import { Router } from "express";
import { refreshTokenGuard } from "../../auth/middlewares/refresh-token.guard-middleware";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { DeviceSessionsController } from "../controllers/device-sessions.controller";

export const deviceSessionsRouter = Router({});

const deviceSessionsController = appContainer.get<DeviceSessionsController>(
    TYPES.DeviceSessionsController,
);

deviceSessionsRouter
    .get("/", refreshTokenGuard, deviceSessionsController.getDeviceSessions)

    .delete(
        "/",
        refreshTokenGuard,
        deviceSessionsController.deleteOtherSessions,
    )

    .delete(
        "/:deviceId",
        refreshTokenGuard,
        deviceSessionsController.deleteSessionById,
    );
