import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../core/ioc/types';
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { User } from '../domain/user';
import { UserRepository } from '../repositories/user.repository';
import { UserQueryInput } from '../routers/input/user-query.input';
import { UserAttributes } from './dtos/user-attributes';

@injectable()
export class UsersService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: UserRepository,
        @inject(TYPES.BcryptService)
        private readonly bcryptService: BcryptService,
    ) {}

    async findUsers(
        queryDto: UserQueryInput,
    ): Promise<{items: WithId<User>[]; totalCount: number}> {
        return this.userRepository.findUsers(queryDto);
    }

    async findUserByIdOrFail(id: string): Promise<WithId<User>> {
        return this.userRepository.findUserByIdOrFail(id);
    }

    async createUser(dto: UserAttributes): Promise<string> {
        const passwordHash = await this.bcryptService.generateHash(dto.password);

        const newUser: User = {
            login: dto.login,
            passwordHash: passwordHash,
            email: dto.email,
            createdAt: new Date().toISOString(),
        };

        return this.userRepository.createUser(newUser);
    }

    async deleteUserById(id: string): Promise<void> {
        await this.userRepository.deleteUserById(id);
    }
}