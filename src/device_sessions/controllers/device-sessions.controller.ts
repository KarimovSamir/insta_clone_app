import { inject, injectable } from "inversify";
import { RequestHandler } from "express";
import { TYPES } from "../../core/ioc/types";
import { HttpStatus } from "../../core/types/http-statuses";
import { DeviceSessionsService } from "../application/device-sessions.service";
import { mapToDeviceSessionOutput } from "../routers/mappers/map-to-device-session-output.util";

@injectable()
export class DeviceSessionsController {
    constructor(
        @inject(TYPES.DeviceSessionsService)
        private readonly deviceSessionsService: DeviceSessionsService,
    ) {}

    getDeviceSessions: RequestHandler = async (req, res) => {
        const payload: { userId: string; deviceId: string } =
            res.locals.refreshPayload;
        const sessions = await this.deviceSessionsService.findSessionsByUserId(
            payload.userId,
        );
        const result = sessions.map(mapToDeviceSessionOutput);

        res.status(HttpStatus.Ok).json(result);
    };

    deleteOtherSessions: RequestHandler = async (req, res) => {
        const payload: { userId: string; deviceId: string } =
            res.locals.refreshPayload;
        await this.deviceSessionsService.deleteAllSessionsExcept(
            payload.userId,
            payload.deviceId,
        );

        res.sendStatus(HttpStatus.NoContent);
    };

    deleteSessionById: RequestHandler<{ deviceId: string }> = async (
        req,
        res,
    ) => {
        const current = res.locals.refreshPayload as {
            userId: string;
            deviceId: string;
        };
        const deviceIdToDelete = req.params.deviceId;

        const session =
            await this.deviceSessionsService.findByDeviceId(deviceIdToDelete);

        if (!session) {
            res.sendStatus(HttpStatus.NotFound);
            return;
        }

        if (session.userId !== current.userId) {
            res.sendStatus(HttpStatus.Forbidden);
            return;
        }

        await this.deviceSessionsService.deleteSession(
            current.userId,
            deviceIdToDelete,
        );

        res.sendStatus(HttpStatus.NoContent);
    };
}
