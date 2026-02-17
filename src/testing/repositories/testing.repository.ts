import { injectable } from "inversify";
import {
    blacklistRefTokenCollection,
    blogCollection,
    commentCollection,
    deviceSessionsCollection,
    postCollection,
    rateLimitCollection,
    userCollection,
} from "../../db/mongo.db";

@injectable()
export class TestingRepository {
    async deleteAllData(): Promise<void> {
        await Promise.all([
            postCollection.deleteMany(),
            blogCollection.deleteMany(),
            userCollection.deleteMany(),
            commentCollection.deleteMany(),
            blacklistRefTokenCollection.deleteMany(),
            deviceSessionsCollection.deleteMany(),
            rateLimitCollection.deleteMany(),
        ]);
    }
}
