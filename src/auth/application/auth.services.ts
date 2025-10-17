import { bcryptService } from '../adapters/bcrypt.service';
import { authRepository } from '../repositories/auth.repository';
import { AuthAttributes } from './dtos/auth-attributes';

export const authService = {
    async validateCredentials(dto: AuthAttributes): Promise<boolean> {
        const user = await authRepository.findUserByLoginOrEmail(dto.loginOrEmail);

        if (!user) {
            return false;
        }

        return bcryptService.checkPassword(dto.password, user.passwordHash);
    },
};