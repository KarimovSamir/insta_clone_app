import { WithId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { User } from '../../users/domain/user';

export const authRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
        return userCollection.findOne({
            $or: [
                { login: loginOrEmail },
                { email: loginOrEmail.toLowerCase() },
            ],
        });
    },
};