import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { JwtService } from "../adapters/jwt.service";
import { UserRepository } from "../../users/repositories/user.repository";

const jwtService = appContainer.get<JwtService>(TYPES.JwtService);
const userRepository = appContainer.get<UserRepository>(TYPES.UserRepository);

export const bearerAuthGuard = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const auth = req.headers["authorization"];
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const token = auth.substring("Bearer ".length);
    const payload = await jwtService.verifyAccessToken(token); // { userId } | null
    if (!payload?.userId) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    try {
        const user = await userRepository.findUserByIdOrFail(payload.userId);
        if (!user) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        res.locals.currentUser = user as any;
        return next();
    } catch {
        return res.sendStatus(HttpStatus.Unauthorized);
    }
};
