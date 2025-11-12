import { rateLimitCollection } from "../../db/mongo.db";
import { RateLimitRecord } from "../domain/rate-limit-record";

export const rateLimitRepository = {
    async addRecord(record: RateLimitRecord): Promise<void> {
        await rateLimitCollection.insertOne(record);
    },

    async countRequests(ip: string, url: string, fromDate: Date): Promise<number> {
        return rateLimitCollection.countDocuments({
            ip,
            url,
            date: { $gte: fromDate },
        });
    },
};
