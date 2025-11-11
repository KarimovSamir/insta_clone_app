import { Request, Response } from "express";
import { deviceSessionsService } from "../../../device_sessions/application/device-sessions.service";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function deleteOtherDeviceSessionsHandler(req: Request, res: Response) {
    const payload: { userId: string; deviceId: string } = res.locals.refreshPayload;
    await deviceSessionsService.deleteAllSessionsExcept(payload.userId, payload.deviceId);
    
    return res.sendStatus(HttpStatus.NoContent);
}
