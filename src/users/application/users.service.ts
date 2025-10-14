import { WithId } from "mongodb";
import { UserQueryInput } from "../routers/input/user-query.input";
import { User } from "../domain/user";
import { usersRepository } from "../repositories/user.repository";
import { UserAttributes } from "./dtos/user-attributes";
import { bcryptService } from "../../auth/adapters/bcrypt.service";

export const usersService = {
    async findUsers(
        queryDto: UserQueryInput,
    ): Promise<{items: WithId<User>[]; totalCount: number}> {
        return usersRepository.findUsers(queryDto);
    },

    async findUserByIdOrFail(id: string): Promise<WithId<User>> {
        return usersRepository.findUserByIdOrFail(id);
    },

    async createUser(dto: UserAttributes): Promise<string> {
        const passwordHash = await bcryptService.generateHash(dto.password);
        
        const newUser: User = {
            login: dto.login,
            passwordHash: passwordHash,
            email: dto.email,
            createdAt: new Date().toISOString(),
        }

        return usersRepository.createUser(newUser);
    },

    async deleteUserById(id: string): Promise<void> {
        await usersRepository.deleteUserById(id);
        return;
    }
}