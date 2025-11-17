// При смене, поменять код и в src\auth\middlewares\rate-limit-auth.middleware.ts
// Верхний код 

// import { rateLimitRepository } from "../repositories/rate-limit.repository";

// const WINDOW_MS = 10_000; // 10 секунд
// const MAX_REQUESTS = 5;

// export const rateLimitService = {
//     WINDOW_MS,
//     MAX_REQUESTS,

//     async registerAndCheck(ip: string, url: string): Promise<boolean> {
//         const now = new Date();
//         const nowIso = now.toISOString();
//         const windowStartIso = new Date(now.getTime() - WINDOW_MS).toISOString();

//         // сначала записываем факт обращения
//         await rateLimitRepository.addRecord({
//             ip,
//             url,
//             date: nowIso,
//         });

//         // потом считаем, сколько запросов было в окне
//         const count = await rateLimitRepository.countRequests(ip, url, windowStartIso);

//         // true = можно, false = надо 429
//         return count <= MAX_REQUESTS;
//     },
// };

import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/ioc/types';
import { RateLimitRepository } from '../repositories/rate-limit.repository';

const WINDOW_MS = 10_000;
const MAX_REQUESTS = 5;

@injectable()
export class RateLimitService {
    public readonly windowMs = WINDOW_MS;
    public readonly maxRequests = MAX_REQUESTS;

    constructor(
        @inject(TYPES.RateLimitRepository)
        private readonly rateLimitRepository: RateLimitRepository,
    ) {}

    async check(ip: string, url: string): Promise<boolean> {
        const now = new Date();
        const windowStart = new Date(now.getTime() - this.windowMs);

        const count = await this.rateLimitRepository.countRequests(
            ip,
            url,
            windowStart,
        );

        return count < this.maxRequests;
    }

    async addRecord(ip: string, url: string): Promise<void> {
        await this.rateLimitRepository.addRecord({ ip, url, date: new Date() });
    }
}
