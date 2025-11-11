import { Request, Response, NextFunction } from "express";
import { rateLimitService } from "../application/rate-limit.service";
import { HttpStatus } from "../../core/types/http-statuses";

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip!;
    const url = (req.originalUrl || "").split("?")[0];

    const isAllowed = await rateLimitService.registerAndCheck(ip, url);

    if (!isAllowed) {
        return res.sendStatus(HttpStatus.TooManyRequests); // 429
    }

    return next();
}
