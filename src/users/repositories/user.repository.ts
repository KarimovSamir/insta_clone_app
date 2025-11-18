import { injectable } from 'inversify';
import { Filter, ObjectId, WithId } from 'mongodb';
import { userCollection } from '../../db/mongo.db';
import { RepositoryBadRequestError } from '../../core/errors/repository-bad-request.error';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { EmailConfirmation, MailPasswordRecovery, User } from '../domain/user';
import { UserQueryInput } from '../routers/input/user-query.input';

@injectable()
export class UserRepository {
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
        const filter: Filter<User> = {};

        const loginFilter = searchLoginTerm
            ? { login: { $regex: searchLoginTerm, $options: 'i' } }
            : null;
        const emailFilter = searchEmailTerm
            ? { email: { $regex: searchEmailTerm, $options: 'i' } }
            : null;

        if (loginFilter && emailFilter) {
            filter.$or = [loginFilter, emailFilter];
        } else if (loginFilter) {
            Object.assign(filter, loginFilter);
        } else if (emailFilter) {
            Object.assign(filter, emailFilter);
        }

        const items = await userCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);

        return { items, totalCount };
    }

    async findUserByIdOrFail(id: string): Promise<WithId<User>> {
        const res = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('User not exist');
        }
        return res;
    }

    async createUser(newUser: User): Promise<string> {
        const login = newUser.login.trim();
        const email = newUser.email.trim().toLowerCase();

        const loginTaken = await userCollection.findOne(
            { login },
            { projection: { _id: 1 } }
        );
        if (loginTaken) {
            throw new RepositoryBadRequestError('Login is already in use', 'login');
        }

        const emailTaken = await userCollection.findOne(
            { email },
            { projection: { _id: 1 } }
        );
        if (emailTaken) {
            throw new RepositoryBadRequestError('Email is already in use', 'email');
        }

        const insertResult = await userCollection.insertOne({ ...newUser, login, email });
        return insertResult.insertedId.toString();
    }

    async deleteUserById(id: string): Promise<void> {
        const deleteResult = await userCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('User not exist');
        }
    }

    async setEmailConfirmationByEmail(email: string, emailConfirmation: EmailConfirmation): Promise<void> {
        await userCollection.updateOne(
            { email: email.trim().toLowerCase() },
            { $set: { emailConfirmation } }
        );
    }

    async findByConfirmationCode(code: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    }

    async confirmUserById(id: string): Promise<void> {
        const res = await userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { 'emailConfirmation.isConfirmed': true },
                $unset: { 'emailConfirmation.confirmationCode': '' }
            }
        );
        if (res.matchedCount < 1) {
            throw new RepositoryNotFoundError('User not exist');
        }
    }



    async findByRecoveryCode(code: string): Promise<WithId<User> | null> {
        return userCollection.findOne({ 'mailPasswordRecovery.recoveryCode': code });
    }

    async setPasswordRecoveryData(email: string, mailPasswordRecovery: MailPasswordRecovery): Promise<void> {
        await userCollection.updateOne(
            { email: email.trim().toLowerCase() },
            { $set: { mailPasswordRecovery } }
        );
    }

    async updateMailPasswordByIdAndClearRecovery(id: string, newPasswordHash: string): Promise<void> {
        const res = await userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { 'passwordHash': newPasswordHash },
                $unset: { 
                    'mailPasswordRecovery.recoveryCode': '',
                    'mailPasswordRecovery.expirationDate': ''
                }
            }
        );
        if (res.matchedCount < 1) {
            throw new RepositoryNotFoundError('User not exist');
        }
    }
}