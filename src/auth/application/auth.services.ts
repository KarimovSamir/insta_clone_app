import { RepositoryBadRequestError } from '../../core/errors/repository-bad-request.error';
import { SETTINGS } from '../../core/settings/settings';
import { usersService } from '../../users/application/users.service';
import { usersRepository } from '../../users/repositories/user.repository';
import { bcryptService } from '../adapters/bcrypt.service';
import { mailer } from '../adapters/resend.mailer';
import { authRepository } from '../repositories/auth.repository';
import { AuthAttributes } from './dtos/auth-attributes';
import { RegistrationAttributes } from './dtos/registration-attributes';
import { randomUUID } from 'crypto';

export const authService = {
    async validateCredentials(dto: AuthAttributes): Promise<boolean> {
        const user = await authRepository.findUserByLoginOrEmail(dto.loginOrEmail);
        if (!user) {
            return false;
        }
        return bcryptService.checkPassword(dto.password, user.passwordHash);
    },

    async registerMail(dto: RegistrationAttributes): Promise<void> {
        await usersService.createUser({
            login: dto.login.trim(),
            password: dto.password,
            email: dto.email.trim().toLowerCase(),
        });

        const code = randomUUID();
        const now = Date.now();
        const email = dto.email.trim().toLowerCase();
        await usersRepository.setEmailConfirmationByEmail(email, {
            confirmationCode: code,
            // 15 минут
            expirationDate: new Date(now + 15 * 60 * 1000).toISOString(),
            isConfirmed: false,
        });

        const confirmLink = `${SETTINGS.FRONTEND_CONFIRM_URL}?code=${encodeURIComponent(code)}`;
        console.log('[mail] env_key?', !!process.env.RESEND_API_KEY, 'settings_key?', !!SETTINGS.RESEND_API_KEY);
        await mailer.send({
            to: dto.email.trim().toLowerCase(),
            subject: 'Confirm your registration',
            html: `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href="${confirmLink}">complete registration</a>
                </p>
            `,
        });

        return;
    },

    async confirmByCode(code: string): Promise<void> {
        const user = await usersRepository.findByConfirmationCode(code);
        if (!user || !user.emailConfirmation) {
            throw new RepositoryBadRequestError('Invalid or expired code', 'code');
        }
        if (user.emailConfirmation.isConfirmed) {
            throw new RepositoryBadRequestError('Invalid or expired code', 'code');
        }
        const exp = new Date(user.emailConfirmation.expirationDate).getTime();
        if (!Number.isFinite(exp) || exp <= Date.now()) {
            throw new RepositoryBadRequestError('Invalid or expired code', 'code');
        }
        await usersRepository.confirmUserById(user._id.toString());
        return;
    },

};