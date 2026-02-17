// export const bcryptService = {
//     async generateHash(password: string) {
//         const bcrypt = require('bcrypt');
//         const salt = await bcrypt.genSalt(10);
//         return bcrypt.hash(password, salt);
//     },

//     async checkPassword(password: string, hash: string) {
//         const bcrypt = require('bcrypt');
//         return bcrypt.compare(password, hash)
//     }
// }

import { injectable } from "inversify";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

function createHash(password: string, salt: string): Buffer {
    return scryptSync(password, salt, 64);
}

@injectable()
export class BcryptService {
    async generateHash(password: string): Promise<string> {
        const salt = randomBytes(16).toString("hex");
        const derivedKey = createHash(password, salt);

        return `${salt}:${derivedKey.toString("hex")}`;
    }

    async checkPassword(password: string, hash: string): Promise<boolean> {
        const [salt, storedHash] = hash.split(":");

        if (!salt || !storedHash) {
            return false;
        }

        const derivedKey = createHash(password, salt);
        const storedHashBuffer = Buffer.from(storedHash, "hex");

        if (storedHashBuffer.length !== derivedKey.length) {
            return false;
        }

        return timingSafeEqual(storedHashBuffer, derivedKey);
    }
}
