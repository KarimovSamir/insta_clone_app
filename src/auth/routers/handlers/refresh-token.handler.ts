import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { SETTINGS } from '../../../core/settings/settings';
import { deviceSessionsService } from '../../../device_sessions/application/device-sessions.service';
import { tokenBlacklistService } from '../../application/token-blacklist.service';

export async function refreshTokenHandler(req: Request, res: Response) {
    const oldRefreshToken: string = res.locals.refreshToken;
    const payload: { userId: string; deviceId: string; exp: number } = res.locals.refreshPayload;

    const session = await deviceSessionsService.findSession(payload.userId, payload.deviceId);
    if (!session) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    await tokenBlacklistService.addRefTokenToBlacklist(oldRefreshToken, payload.exp);

    const newAccessToken = await jwtService.createAccessToken(payload.userId);
    const newRefreshToken = await jwtService.createRefreshToken(payload.userId, payload.deviceId);

    const now = new Date();
    const newLastActive = now.toISOString();
    const newExp = new Date(now.getTime() + SETTINGS.RT_TIME * 1000).toISOString();

    await deviceSessionsService.updateSession(
        payload.userId,
        payload.deviceId,
        newLastActive,
        newExp,
    );

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,        // локально false. В проде true.
        sameSite: 'strict',
        maxAge: SETTINGS.RT_TIME * 1000,
    });

    return res.status(HttpStatus.Ok).json({ accessToken: newAccessToken });
}

// Нужно
// из refreshPayload взять ещё и deviceId
// по ним найти сессию в БД
// если такой сессии нет 401 ошибочка
// если есть, то обновить у неё lastActiveDate и exp
// положить старый refresh в blacklist коллекцию
// выдать новую пару токенов с тем же deviceId
// жесть конечно