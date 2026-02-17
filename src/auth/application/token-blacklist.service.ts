import { inject, injectable } from "inversify";
import { TYPES } from "../../core/ioc/types";
import { TokenBlacklistRepository } from "../repositories/token-blacklist.repository";

@injectable()
export class TokenBlacklistService {
    constructor(
        @inject(TYPES.TokenBlacklistRepository)
        private readonly tokenBlacklistRepository: TokenBlacklistRepository,
    ) {}

    async addRefTokenToBlacklist(token: string, exp: number): Promise<void> {
        return this.tokenBlacklistRepository.addRefTokenToBlacklist(token, exp);
    }

    async isBlacklisted(token: string): Promise<boolean> {
        return this.tokenBlacklistRepository.isBlacklisted(token);
    }
}
