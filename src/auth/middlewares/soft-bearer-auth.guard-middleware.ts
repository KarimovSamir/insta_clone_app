import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { JwtService } from "../adapters/jwt.service";
import { UserRepository } from "../../users/repositories/user.repository";

// В src\posts\controllers\posts.controller.ts есть метод getPostComments
// Там есть код const currentUser = res.locals.currentUser;
// Там нужен юзер чтобы получить статус комментария
// Но нам нужна тогда авторизация
// Если заходит авторизованный пользователь (есть токен), сервер должен это понять, чтобы показать его лайк
// Если заходит гость (без токена), сервер пускает его, но показывает None

// const jwtService = appContainer.get<JwtService>(TYPES.JwtService);
// const userRepository = appContainer.get<UserRepository>(TYPES.UserRepository);

export const softBearerAuthGuard = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const jwtService = appContainer.get<JwtService>(TYPES.JwtService);
    const userRepository = appContainer.get<UserRepository>(TYPES.UserRepository);

    const auth = req.headers["authorization"];
    if (!auth || !auth.startsWith("Bearer ")) {
        return next()
    }

    const token = auth.substring("Bearer ".length);
    const payload = await jwtService.verifyAccessToken(token); // { userId } | null
    if (!payload?.userId) {
        return next()
    }

    try {
        const user = await userRepository.findUserByIdOrFail(payload.userId);
        if (!user) {
            return next()
        }

        res.locals.currentUser = user as any;
        return next();
    } catch {
        return next()
    }
};
