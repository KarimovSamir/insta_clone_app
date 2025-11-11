import { Request, Response } from "express";
import { deviceSessionsService } from "../../../device_sessions/application/device-sessions.service";
import { mapToDeviceSessionOutput } from "../mappers/map-to-device-session-output.util";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getDeviceSessionsHandler(req: Request, res: Response) {
    const payload: { userId: string; deviceId: string } = res.locals.refreshPayload;
    const sessions = await deviceSessionsService.findSessionsByUserId(payload.userId);
    const result = sessions.map(mapToDeviceSessionOutput);

    return res.status(HttpStatus.Ok).json(result);
}
