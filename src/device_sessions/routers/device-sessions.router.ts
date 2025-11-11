import { Router } from "express";
import { refreshTokenGuard } from "../../auth/middlewares/refresh-token.guard-middleware";
import { getDeviceSessionsHandler } from "./handlers/get-device-sessions.handler";
import { deleteOtherDeviceSessionsHandler } from "./handlers/delete-other-device-sessions.handler";
import { deleteDeviceSessionByIdHandler } from "./handlers/delete-device-session-by-id.handler";

export const deviceSessionsRouter = Router({});

deviceSessionsRouter
    .get(
        '/', 
        refreshTokenGuard, 
        getDeviceSessionsHandler,
    )

    .delete(
        '/', 
        refreshTokenGuard,
        deleteOtherDeviceSessionsHandler,
    )

    .delete(
        '/:deviceId', 
        refreshTokenGuard, 
        deleteDeviceSessionByIdHandler,
    )
