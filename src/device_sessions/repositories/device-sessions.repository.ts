import { injectable } from 'inversify';
import { deviceSessionsCollection } from '../../db/mongo.db';
import { DeviceSession } from '../domain/device-session';

@injectable()
export class DeviceSessionsRepository {
    async createSession(session: DeviceSession): Promise<void> {
        await deviceSessionsCollection.insertOne(session);
    }

    async findSessionsByUserId(userId: string): Promise<DeviceSession[]> {
        return deviceSessionsCollection.find({ userId }).toArray();
    }

    async findSession(
        userId: string,
        deviceId: string,
    ): Promise<DeviceSession | null> {
        return deviceSessionsCollection.findOne({ userId, deviceId });
    }

    async updateSession(
        userId: string,
        deviceId: string,
        lastActiveDate: string,
        exp: string,
    ): Promise<boolean> {
        const result = await deviceSessionsCollection.updateOne(
            { userId, deviceId },
            { $set: { lastActiveDate, exp } },
        );
        return result.matchedCount === 1;
    }

    async deleteSession(userId: string, deviceId: string): Promise<boolean> {
        const result = await deviceSessionsCollection.deleteOne({ userId, deviceId });
        return result.deletedCount === 1;
    }

    async deleteAllSessionsExcept(
        userId: string,
        deviceIdToKeep: string,
    ): Promise<void> {
        await deviceSessionsCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceIdToKeep },
        });
    }

    async findByDeviceId(deviceId: string): Promise<DeviceSession | null> {
        return deviceSessionsCollection.findOne({ deviceId });
    }
}
