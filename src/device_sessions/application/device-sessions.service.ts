import { inject, injectable } from "inversify";
import { TYPES } from "../../core/ioc/types";
import { DeviceSessionsRepository } from "../repositories/device-sessions.repository";
import { DeviceSession } from "../domain/device-session";
import { DeviceSessionAttributes } from "./dtos/device-session-attributes";

@injectable()
export class DeviceSessionsService {
    constructor(
        @inject(TYPES.DeviceSessionsRepository)
        private readonly deviceSessionsRepository: DeviceSessionsRepository,
    ) {}

    async createSession(dto: DeviceSessionAttributes): Promise<void> {
        const newSession: DeviceSession = {
            userId: dto.userId,
            deviceId: dto.deviceId,
            ip: dto.ip,
            title: dto.title,
            lastActiveDate: dto.lastActiveDate,
            exp: dto.exp,
        };

        await this.deviceSessionsRepository.createSession(newSession);
    }

    async findSession(
        userId: string,
        deviceId: string,
    ): Promise<DeviceSession | null> {
        return this.deviceSessionsRepository.findSession(userId, deviceId);
    }

    async findSessionsByUserId(userId: string): Promise<DeviceSession[]> {
        return this.deviceSessionsRepository.findSessionsByUserId(userId);
    }

    async deleteSession(userId: string, deviceId: string): Promise<boolean> {
        return this.deviceSessionsRepository.deleteSession(userId, deviceId);
    }

    async updateSession(
        userId: string,
        deviceId: string,
        lastActiveDate: string,
        exp: string,
    ): Promise<boolean> {
        return this.deviceSessionsRepository.updateSession(
            userId,
            deviceId,
            lastActiveDate,
            exp,
        );
    }

    async deleteAllSessionsExcept(
        userId: string,
        deviceIdToKeep: string,
    ): Promise<void> {
        await this.deviceSessionsRepository.deleteAllSessionsExcept(
            userId,
            deviceIdToKeep,
        );
    }

    async findByDeviceId(deviceId: string): Promise<DeviceSession | null> {
        return this.deviceSessionsRepository.findByDeviceId(deviceId);
    }
}
