import { deviceSessionsCollection } from "../../db/mongo.db";
import { DeviceSession } from "../domain/device-session";

export const deviceSessionsRepository = {
    // Создать сессию которую вызываем при логине
    async createSession(session: DeviceSession): Promise<void> {
        await deviceSessionsCollection.insertOne(session);
    },

    async findSessionsByUserId(userId: string): Promise<DeviceSession[]> {
        return deviceSessionsCollection.find({ userId }).toArray();
    },

    // Найти конкретную сессию пользователя по deviceId
    // пригодится при refresh и при delete
    async findSession(userId: string, deviceId: string): Promise<DeviceSession | null> {
        return deviceSessionsCollection.findOne({ userId, deviceId });
    },

    // Обновить сессию
    async updateSession(
        userId: string,
        deviceId: string,
        lastActiveDate: string,
        exp: string,
    ): Promise<boolean> {
        const result = await deviceSessionsCollection.updateOne(
          { userId, deviceId },
          { $set: { lastActiveDate, exp } }
        );
        return result.matchedCount === 1;
    },

    // Удалить конкретную сессию
    async deleteSession(userId: string, deviceId: string): Promise<boolean> {
        const result = await deviceSessionsCollection.deleteOne({ userId, deviceId });
        return result.deletedCount === 1;
    },

    // Удалить все сессии пользователя, кроме текущей
    async deleteAllSessionsExcept(userId: string, deviceIdToKeep: string): Promise<void> {
        await deviceSessionsCollection.deleteMany({
          userId,
          deviceId: { $ne: deviceIdToKeep },
        });
    },

    async findByDeviceId(deviceId: string): Promise<DeviceSession | null> {
        return deviceSessionsCollection.findOne({ deviceId });
    },
};
