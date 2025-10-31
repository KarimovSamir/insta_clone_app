import { blacklistRefTokenCollection } from "../../db/mongo.db";

export const tokenBlacklistRepository = {
    async addRefTokenToBlacklist(token: string, exp: number): Promise<void> {
        await blacklistRefTokenCollection.insertOne({
            token,
            exp: new Date(exp * 1000),
            createdAt: new Date(),
        });
    },

    async isBlacklisted(token: string): Promise<boolean> {
        const doc = await blacklistRefTokenCollection.findOne({ token });
        return !!doc;
    },

    async deleteExpiredRefTokens(): Promise<void> {
        await blacklistRefTokenCollection.deleteMany({
            exp: { $lt: new Date() },
        });
    },
};
