import { DeviceSession } from "../domain/device-session";
import { deviceSessionsRepository } from "../repositories/device-sessions.repository";
import { DeviceSessionAttributes } from "./dtos/device-session-attributes";

export const deviceSessionsService = {
    async createSession(dto: DeviceSessionAttributes): Promise<void> {
        const newSession: DeviceSession = {
            userId: dto.userId,
            deviceId: dto.deviceId,
            ip: dto.ip,
            title: dto.title,
            lastActiveDate: dto.lastActiveDate,
            exp: dto.exp,
        };

        return deviceSessionsRepository.createSession(newSession);
    },

    async findSession(userId: string, deviceId: string): Promise<DeviceSession | null> {
        return deviceSessionsRepository.findSession(userId, deviceId);
    },

    async findSessionsByUserId(userId: string): Promise<DeviceSession[]> {
        return deviceSessionsRepository.findSessionsByUserId(userId);
    },

    async deleteSession(userId: string, deviceId: string): Promise<boolean> {
        return deviceSessionsRepository.deleteSession(userId, deviceId);
    },

    async updateSession(
        userId: string,
        deviceId: string,
        lastActiveDate: string,
        exp: string,
    ): Promise<boolean> {
        return deviceSessionsRepository.updateSession(userId, deviceId, lastActiveDate, exp);
    },

    async deleteAllSessionsExcept(userId: string, deviceIdToKeep: string): Promise<void> {
        return deviceSessionsRepository.deleteAllSessionsExcept(userId, deviceIdToKeep);
    },

    // для проверки чужой/не чужой девайс
    async findByDeviceId(deviceId: string): Promise<DeviceSession | null> {
        return deviceSessionsRepository.findByDeviceId(deviceId);
    },

}