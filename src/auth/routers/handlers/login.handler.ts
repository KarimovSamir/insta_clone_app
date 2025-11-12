import { Request, Response } from 'express';
import { AuthLoginInput } from '../input/auth-login.input';
import { AuthAttributes } from '../../application/dtos/auth-attributes';
import { authService } from '../../application/auth.services';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { authRepository } from '../../repositories/auth.repository';
import { SETTINGS } from '../../../core/settings/settings';
import { DeviceSessionAttributes } from '../../../device_sessions/application/dtos/device-session-attributes';
import { randomUUID } from 'crypto';
import { deviceSessionsService } from '../../../device_sessions/application/device-sessions.service';

export async function loginHandler(
    req: Request<{}, {}, AuthLoginInput>,
    res: Response,
) {
    const credentials: AuthAttributes = {
        loginOrEmail: req.body.loginOrEmail,
        password: req.body.password,
    };

    const isValid = await authService.validateCredentials(credentials);

    if (!isValid) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const user = await authRepository.findUserByLoginOrEmail(
        credentials.loginOrEmail.trim(),
    );
    if (!user) {
        // Чтобы user не ругался на null
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const sessionDeviceId = randomUUID();
    const now = new Date();

    const sessionCredentials: DeviceSessionAttributes = {
        ip: req.ip!, // работает из-за trust proxy в index.ts
        title: req.get("user-agent") ?? "Unknown device",
        lastActiveDate: now.toISOString(),
        deviceId: sessionDeviceId,
        userId: user._id.toString(),
        exp: new Date(now.getTime() + SETTINGS.RT_TIME * 1000).toISOString(),
    };

    await deviceSessionsService.createSession(sessionCredentials);

    const accToken = await jwtService.createAccessToken(user._id.toString());
    const refreshToken = await jwtService.createRefreshToken(user._id.toString(), sessionDeviceId);

    // res.cookie('refreshToken', refreshToken, {
    //     httpOnly: true,
    //     secure: true, // локально false, в проде true
    //     sameSite: 'strict',
    //     maxAge: SETTINGS.RT_TIME * 1000,
    // });

    // return res.status(HttpStatus.Ok).json({ accessToken: accToken });

    // Короче, если res.cookie ответ упал, в БД останется мертвая сессия, то есть всё равно происходит запись в БД
    // При этом нет проблем, пользователь не пройдёт логин. Но запись в БД всё равно будет. 
    // При try catch мы отлавливаем (надеюсь) сдохшую сессию и удаляем сессию, которая и не должна быть
    try {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // локально false, в проде true
            sameSite: 'strict',
            maxAge: SETTINGS.RT_TIME * 1000,
        });
        return res.status(HttpStatus.Ok).json({ accessToken: accToken });
    } catch (e) {
        // удалим только что созданную сессию
        await deviceSessionsService.deleteSession(user._id.toString(), sessionDeviceId);
        throw e;
    }

    // return res.sendStatus(HttpStatus.NoContent);
}