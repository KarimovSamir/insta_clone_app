export const bcryptService = {
    async generateHash(password: string) {
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    },

    async checkPassword(password: string, hash: string) {
        const bcrypt = require('bcrypt');
        return bcrypt.compare(password, hash)
    }
}