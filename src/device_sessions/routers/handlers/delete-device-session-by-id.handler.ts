import { Request, Response } from "express";
import { deviceSessionsService } from "../../../device_sessions/application/device-sessions.service";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function deleteDeviceSessionByIdHandler(req: Request, res: Response) {
    const current = res.locals.refreshPayload as { userId: string; deviceId: string };
    const deviceIdToDelete = req.params.deviceId;

    const session = await deviceSessionsService.findByDeviceId(deviceIdToDelete);
    if (!session) {
        return res.sendStatus(HttpStatus.NotFound);
    }

    if (session.userId !== current.userId) {
        return res.sendStatus(HttpStatus.Forbidden);
    }

    await deviceSessionsService.deleteSession(current.userId, deviceIdToDelete);

    return res.sendStatus(HttpStatus.NoContent);
}
