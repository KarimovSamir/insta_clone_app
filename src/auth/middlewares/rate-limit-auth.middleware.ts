import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../core/types/http-statuses";

// массив меток времени
const requestsStore = new Map<string, number[]>();
// 10 секунд
const WINDOW_MS = 10_000;
// максимум 5
const MAX_REQUESTS = 5;

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const endpoint = req.originalUrl;
    const key = `${ip}:${endpoint}`;

    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // берём старый список
    const timestamps = requestsStore.get(key) || [];
    const recent = timestamps.filter(ts => ts > windowStart);

    if (recent.length >= MAX_REQUESTS) {
        return res.sendStatus(HttpStatus.TooManyRequests); // 429
    }

    recent.push(now);
    requestsStore.set(key, recent);

    return next();
}
