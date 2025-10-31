import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { tokenBlacklistRepository } from '../repositories/token-blacklist.repository';
import { jwtService } from '../adapters/jwt.service';

export async function refreshTokenGuard(req: Request, res: Response, next: NextFunction) {
    // берём refreshToken из куки
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(HttpStatus.Unauthorized); // 401
    }

    // проверка не в blacklist ли он уже
    const blacklisted = await tokenBlacklistRepository.isBlacklisted(refreshToken);
    if (blacklisted) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // проверяем подписи и срок жизни токена
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId || !payload.exp) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // кладём данные в res.locals как и в случае с bearer
    // чтобы дальше хендлер мог ими пользоваться без повторной верификации
    res.locals.refreshToken = refreshToken;
    res.locals.refreshPayload = payload;

    return next();
}
