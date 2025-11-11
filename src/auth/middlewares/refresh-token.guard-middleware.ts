import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';
import { tokenBlacklistService } from '../application/token-blacklist.service';

export async function refreshTokenGuard(req: Request, res: Response, next: NextFunction) {
    // берём refreshToken из куки
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(HttpStatus.Unauthorized); // 401
    }

    // проверка не в blacklist ли он уже
    const blacklisted = await tokenBlacklistService.isBlacklisted(refreshToken);
    if (blacklisted) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // проверяем подписи и срок жизни токена
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId || !payload.exp || !payload.deviceId) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // кладём данные в res.locals как и в случае с bearer
    // чтобы дальше хендлер мог ими пользоваться без повторной верификации
    res.locals.refreshToken = refreshToken;
    res.locals.refreshPayload = payload;

    return next();
}
