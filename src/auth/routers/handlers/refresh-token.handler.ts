import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { tokenBlacklistRepository } from '../../repositories/token-blacklist.repository';
import { SETTINGS } from '../../../core/settings/settings';

export async function refreshTokenHandler(req: Request, res: Response) {
    const oldRefreshToken: string = res.locals.refreshToken;
    const payload: { userId: string; exp: number } = res.locals.refreshPayload;

    await tokenBlacklistRepository.addRefTokenToBlacklist(oldRefreshToken, payload.exp);

    const newAccessToken = await jwtService.createAccessToken(payload.userId);
    const newRefreshToken = await jwtService.createRefreshToken(payload.userId);

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,        // локально false. В проде true.
        sameSite: 'strict',
        maxAge: SETTINGS.RT_TIME * 1000,
    });

    return res.status(HttpStatus.Ok).json({ accessToken: newAccessToken });
}
