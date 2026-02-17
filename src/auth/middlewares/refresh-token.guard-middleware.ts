import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { JwtService } from "../adapters/jwt.service";
import { TokenBlacklistService } from "../application/token-blacklist.service";
import { DeviceSessionsService } from "../../device_sessions/application/device-sessions.service";
import { RefreshPayload } from "../domain/jwt-payloads";

const jwtService = appContainer.get<JwtService>(TYPES.JwtService);
const tokenBlacklistService = appContainer.get<TokenBlacklistService>(
    TYPES.TokenBlacklistService,
);
const deviceSessionsService = appContainer.get<DeviceSessionsService>(
    TYPES.DeviceSessionsService,
);

export async function refreshTokenGuard(
    req: Request,
    res: Response,
    next: NextFunction,
) {
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
    if (!payload?.userId || !payload?.deviceId || !payload?.exp) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // проверка, что сессия всё ещё существует
    const session = await deviceSessionsService.findSession(
        payload.userId,
        payload.deviceId,
    );
    if (!session) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // проверка session.exp. парсим потому что первоначально строка
    // Доп проверка, потому что у сессии и токена может быть разное время жизни
    // И если даже токен ещё жив, то сессия уже может быть не рабочей
    // Например если сессия должна вырубаться через 30 дней.
    // В момент когда сессия должна вырубиться, токен может обновиться
    const expMs = Date.parse(session.exp);
    if (Number.isFinite(expMs) && expMs < Date.now()) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    // кладём данные в res.locals как и в случае с bearer
    // чтобы дальше хендлер мог ими пользоваться без повторной верификации
    res.locals.refreshToken = refreshToken;
    res.locals.refreshPayload = payload as RefreshPayload;

    return next();
}
