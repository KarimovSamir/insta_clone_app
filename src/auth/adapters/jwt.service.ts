import jwt from "jsonwebtoken";
import 'dotenv/config';
import { SETTINGS } from "../../core/settings/settings";

export const jwtService = {
    async createAccessToken(userId: string): Promise<string> {
        return jwt.sign({ userId }, SETTINGS.AC_SECRET, {
            expiresIn: SETTINGS.AC_TIME,
        });
    },
    async createRefreshToken(userId: string): Promise<string> {
        return jwt.sign({ userId }, SETTINGS.RT_SECRET, {
            expiresIn: SETTINGS.RT_TIME,
        });
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyAccessToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
    async verifyRefreshToken(token: string): Promise<{ userId: string; exp: number } | null> {
        try {
            // exp при добавлении в blacklist и для очистки
            return jwt.verify(token, SETTINGS.RT_SECRET) as { userId: string; exp: number };
        } catch (error) {
            console.error("Refresh token verify error");
            return null;
        }
    },
};