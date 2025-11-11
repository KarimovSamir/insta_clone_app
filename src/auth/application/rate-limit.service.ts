import { rateLimitRepository } from "../repositories/rate-limit.repository";

const WINDOW_MS = 10_000; // 10 секунд
const MAX_REQUESTS = 5;

export const rateLimitService = {
    WINDOW_MS,
    MAX_REQUESTS,

    async registerAndCheck(ip: string, url: string): Promise<boolean> {
        const now = new Date();
        const nowIso = now.toISOString();
        const windowStartIso = new Date(now.getTime() - WINDOW_MS).toISOString();

        // сначала записываем факт обращения
        await rateLimitRepository.addRecord({
            ip,
            url,
            date: nowIso,
        });

        // потом считаем, сколько запросов было в окне
        const count = await rateLimitRepository.countRequests(ip, url, windowStartIso);

        // true = можно, false = надо 429
        return count <= MAX_REQUESTS;
    },
};
