import { DeviceSession } from "../../domain/device-session";
import { DeviceSessionOutput } from "../output/device-session.output";

export function mapToDeviceSessionOutput(
    deviceSession: DeviceSession,
): DeviceSessionOutput {
    return {
        ip: deviceSession.ip,
        title: deviceSession.title,
        lastActiveDate: deviceSession.lastActiveDate,
        deviceId: deviceSession.deviceId,
    };
}
