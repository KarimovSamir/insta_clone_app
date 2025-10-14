import { userCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UserQueryInput } from '../routers/input/user-query.input';
import { User } from '../domain/user';
import { DuplicateFieldError } from '../../core/errors/duplicate-field.error';

export const usersRepository = {
    async findUsers(
        queryDto: UserQueryInput,
    ): Promise<{ items: WithId<User>[]; totalCount: number }> {
        const {
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' };
        }

        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }

        const items = await userCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findUserByIdOrFail(id: string): Promise<WithId<User>> {
        const res = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('User not exist');
        }
        return res;
    },

    async createUser(newUser: User): Promise<string>{
        const login = newUser.login.trim();
        const email = newUser.email.trim().toLowerCase();

        const loginTaken = await userCollection.findOne(
            { login },
            { projection: { _id: 1 } }
        );
        if (loginTaken) {
            throw new DuplicateFieldError('login', 'Login is already in use');
        }

        const emailTaken = await userCollection.findOne(
            { email },
            { projection: { _id: 1 } }
        );
        if (emailTaken) {
            throw new DuplicateFieldError('email', 'Email is already in use');
        }

        const insertResult = await userCollection.insertOne({ ...newUser, login, email });
        return insertResult.insertedId.toString();
    },

    async deleteUserById(id: string): Promise<void>{
        const deleteResult = await userCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('User not exist');
        }
        return;
    },
}