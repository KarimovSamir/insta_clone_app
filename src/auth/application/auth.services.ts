import { inject, injectable } from 'inversify';
import { randomUUID } from 'crypto';
import { RepositoryBadRequestError } from '../../core/errors/repository-bad-request.error';
import { TYPES } from '../../core/ioc/types';
import { SETTINGS } from '../../core/settings/settings';
import { UsersService } from '../../users/application/users.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { BcryptService } from '../adapters/bcrypt.service';
import { MailerService } from '../adapters/resend.mailer';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthAttributes } from './dtos/auth-attributes';
import { RegistrationAttributes } from './dtos/registration-attributes';

@injectable()
export class AuthService {
    constructor(
        @inject(TYPES.AuthRepository)
        private readonly authRepository: AuthRepository,
        @inject(TYPES.UsersService)
        private readonly usersService: UsersService,
        @inject(TYPES.UserRepository)
        private readonly userRepository: UserRepository,
        @inject(TYPES.BcryptService)
        private readonly bcryptService: BcryptService,
        @inject(TYPES.MailerService)
        private readonly mailer: MailerService,
    ) {}

    async validateCredentials(dto: AuthAttributes): Promise<boolean> {
        const user = await this.authRepository.findUserByLoginOrEmail(
            dto.loginOrEmail,
        );
        if (!user) {
            return false;
        }
        return this.bcryptService.checkPassword(dto.password, user.passwordHash);
    }

    async registerMail(dto: RegistrationAttributes): Promise<void> {
        await this.usersService.createUser({
            login: dto.login.trim(),
            password: dto.password,
            email: dto.email.trim().toLowerCase(),
        });

        const code = randomUUID();
        const now = Date.now();
        const email = dto.email.trim().toLowerCase();
        await this.userRepository.setEmailConfirmationByEmail(email, {
            confirmationCode: code,
            expirationDate: new Date(now + 15 * 60 * 1000).toISOString(),
            isConfirmed: false,
        });

        const confirmLink = `${SETTINGS.FRONTEND_CONFIRM_URL}?code=${encodeURIComponent(
            code,
        )}`;
        await this.mailer.send({
            to: email,
            subject: 'Confirm your registration',
            html: `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href="${confirmLink}">complete registration</a>
                </p>
            `,
        });
    }

    async resendingMail(userEmail: string): Promise<void> {
        const code = randomUUID();
        const now = Date.now();
        const email = userEmail.trim().toLowerCase();
        await this.userRepository.setEmailConfirmationByEmail(email, {
            confirmationCode: code,
            expirationDate: new Date(now + 15 * 60 * 1000).toISOString(),
            isConfirmed: false,
        });

        const confirmLink = `${SETTINGS.FRONTEND_CONFIRM_URL}?code=${encodeURIComponent(
            code,
        )}`;
        await this.mailer.send({
            to: email,
            subject: 'Confirm your registration',
            html: `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href="${confirmLink}">complete registration</a>
                </p>
            `,
        });
    }

    async confirmByCode(code: string): Promise<void> {
        const user = await this.userRepository.findByConfirmationCode(code);
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
        await this.userRepository.confirmUserById(user._id.toString());
    }
}