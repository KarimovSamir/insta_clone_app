import { injectable } from "inversify";
import { WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { User } from "../../users/domain/user";

@injectable()
export class AuthRepository {
    async findUserByLoginOrEmail(
        loginOrEmail: string,
    ): Promise<WithId<User> | null> {
        return userCollection.findOne({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail.toLowerCase() },
            ],
        });
    }
}
