import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { tokenBlacklistService } from '../../application/token-blacklist.service';
import { deviceSessionsService } from '../../../device_sessions/application/device-sessions.service';

export async function logoutHandler(req: Request, res: Response) {
    const refreshToken: string = res.locals.refreshToken;
    const payload: { userId: string; deviceId: string; exp: number } = res.locals.refreshPayload;
    
    await tokenBlacklistService.addRefTokenToBlacklist(refreshToken, payload.exp);
    await deviceSessionsService.deleteSession(payload.userId, payload.deviceId);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true, // локально false. В проде true.
        sameSite: 'strict',
    });

    return res.sendStatus(HttpStatus.NoContent);
}
