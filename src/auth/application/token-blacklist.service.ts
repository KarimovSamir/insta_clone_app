import { tokenBlacklistRepository } from '../repositories/token-blacklist.repository';

export const tokenBlacklistService = {
    async addRefTokenToBlacklist(token: string, exp: number): Promise<void> {
        return tokenBlacklistRepository.addRefTokenToBlacklist(token, exp);
    },

    async isBlacklisted(token: string): Promise<boolean> {
        return tokenBlacklistRepository.isBlacklisted(token);
    },
};