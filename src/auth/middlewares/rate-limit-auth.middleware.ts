// При смене, поменять код и в src\auth\application\rate-limit.service.ts
// Тут два варианта. Верхний код, это полный аудит. Нижний, жалеем БД и не пишем всё подрят
// Пояснение верхнего кода.
// Каждый запрос - это запись в БД
// После уже считаем, сколько записей за 10 секунд. Если больше 5, то ошибка, если меньше, то пропускаем

// Пояснение нижнего кода
// Тут мы сначала считаем сколько было запросов за 10 секунд, а потом уже записываем в БД
// А если их больше 5, то тогда сразу ошибка, без лишних записях

// Пример:
// За 10 сек пользователь делает 12 запросов.
// Верхний код: в БД будет 12 записей (первые 5 нет ошибки, следующие 7 ошибка 429, но все 12 сохранятся)
// Нижний код: в БД будет 5 записей (первые 5 нет ошибки, остальные 7 ошибка 429, не сохраняются)

// import { Request, Response, NextFunction } from "express";
// import { rateLimitService } from "../application/rate-limit.service";
// import { HttpStatus } from "../../core/types/http-statuses";

// export async function rateLimitAuthMiddleware(req: Request, res: Response, next: NextFunction) {
//     const ip = req.ip!;
//     const url = (req.originalUrl || "").split("?")[0];

//     const isAllowed = await rateLimitService.registerAndCheck(ip, url);

//     if (!isAllowed) {
//         return res.sendStatus(HttpStatus.TooManyRequests); // 429
//     }

//     return next();
// }

import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { RateLimitService } from "../application/rate-limit.service";

const rateLimitService = appContainer.get<RateLimitService>(
    TYPES.RateLimitService,
);

export async function rateLimitAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const ip = req.ip;
    const url = (req.originalUrl || "").split("?")[0];

    const allowed = await rateLimitService.check(ip!, url);
    if (!allowed) {
        return res.sendStatus(HttpStatus.TooManyRequests);
    }

    // только разрешённые запросы попадают в коллекцию
    await rateLimitService.addRecord(ip!, url);

    return next();
}
