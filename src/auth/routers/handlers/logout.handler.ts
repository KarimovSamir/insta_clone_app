import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { tokenBlacklistRepository } from '../../repositories/token-blacklist.repository';

export async function logoutHandler(req: Request, res: Response) {
    const refreshToken: string = res.locals.refreshToken;
    const payload: { userId: string; exp: number } = res.locals.refreshPayload;

    await tokenBlacklistRepository.addRefTokenToBlacklist(refreshToken, payload.exp);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true, // локально false. В проде true.
        sameSite: 'strict',
    });

    return res.sendStatus(HttpStatus.NoContent);
}
