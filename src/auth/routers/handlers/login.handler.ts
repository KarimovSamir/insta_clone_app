import { Request, Response } from 'express';
import { AuthLoginInput } from '../input/auth-login.input';
import { AuthAttributes } from '../../application/dtos/auth-attributes';
import { authService } from '../../application/auth.services';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { authRepository } from '../../repositories/auth.repository';
import { SETTINGS } from '../../../core/settings/settings';

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

    const accToken = await jwtService.createAccessToken(user._id.toString());
    const refreshToken = await jwtService.createRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // локально false, в проде true
        sameSite: 'strict',
        maxAge: SETTINGS.RT_TIME * 1000,
    });

    return res.status(HttpStatus.Ok).json({ accessToken: accToken });

    // return res.sendStatus(HttpStatus.NoContent);
}