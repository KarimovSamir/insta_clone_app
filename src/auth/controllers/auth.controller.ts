import { inject, injectable } from 'inversify';
import { RequestHandler } from 'express';
import { randomUUID } from 'crypto';
import { TYPES } from '../../core/ioc/types';
import { HttpStatus } from '../../core/types/http-statuses';
import { SETTINGS } from '../../core/settings/settings';
import { RepositoryBadRequestError } from '../../core/errors/repository-bad-request.error';
import { AuthService } from '../application/auth.services';
import { TokenBlacklistService } from '../application/token-blacklist.service';
import { RegistrationAttributes } from '../application/dtos/registration-attributes';
import { AuthRepository } from '../repositories/auth.repository';
import { JwtService } from '../adapters/jwt.service';
import { DeviceSessionsService } from '../../device_sessions/application/device-sessions.service';
import { DeviceSessionAttributes } from '../../device_sessions/application/dtos/device-session-attributes';
import { AuthAttributes } from '../application/dtos/auth-attributes';
import { RefreshPayload } from '../domain/jwt-payloads';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService)
        private readonly authService: AuthService,
        @inject(TYPES.AuthRepository)
        private readonly authRepository: AuthRepository,
        @inject(TYPES.JwtService)
        private readonly jwtService: JwtService,
        @inject(TYPES.DeviceSessionsService)
        private readonly deviceSessionsService: DeviceSessionsService,
        @inject(TYPES.TokenBlacklistService)
        private readonly tokenBlacklistService: TokenBlacklistService,
    ) { }

    login: RequestHandler<unknown, unknown, AuthAttributes> = async (req, res) => {
        const credentials: AuthAttributes = {
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password,
        };

        const isValid = await this.authService.validateCredentials(credentials);

        if (!isValid) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }

        const user = await this.authRepository.findUserByLoginOrEmail(
            credentials.loginOrEmail.trim(),
        );
        if (!user) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }

        const sessionDeviceId = randomUUID();
        const now = new Date();

        const sessionCredentials: DeviceSessionAttributes = {
            ip: req.ip!,
            title: req.get('user-agent') ?? 'Unknown device',
            lastActiveDate: now.toISOString(),
            deviceId: sessionDeviceId,
            userId: user._id.toString(),
            exp: new Date(now.getTime() + SETTINGS.RT_TIME * 1000).toISOString(),
        };

        await this.deviceSessionsService.createSession(sessionCredentials);

        const accessToken = await this.jwtService.createAccessToken(
            user._id.toString(),
        );
        const refreshToken = await this.jwtService.createRefreshToken(
            user._id.toString(),
            sessionDeviceId,
        );

        try {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: SETTINGS.RT_TIME * 1000,
            });
            res.status(HttpStatus.Ok).json({ accessToken });
        } catch (error) {
            await this.deviceSessionsService.deleteSession(
                user._id.toString(),
                sessionDeviceId,
            );
            throw error;
        }
    };

    refreshToken: RequestHandler = async (req, res) => {
        const oldRefreshToken: string = res.locals.refreshToken;
        const payload: RefreshPayload = res.locals.refreshPayload;

        const session = await this.deviceSessionsService.findSession(
            payload.userId,
            payload.deviceId,
        );
        if (!session) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }

        await this.tokenBlacklistService.addRefTokenToBlacklist(
            oldRefreshToken,
            payload.exp!,
        );

        const newAccessToken = await this.jwtService.createAccessToken(
            payload.userId,
        );
        const newRefreshToken = await this.jwtService.createRefreshToken(
            payload.userId,
            payload.deviceId,
        );

        const now = new Date();
        const newLastActive = now.toISOString();
        const newExp = new Date(now.getTime() + SETTINGS.RT_TIME * 1000).toISOString();

        await this.deviceSessionsService.updateSession(
            payload.userId,
            payload.deviceId,
            newLastActive,
            newExp,
        );

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: SETTINGS.RT_TIME * 1000,
        });

        res.status(HttpStatus.Ok).json({ accessToken: newAccessToken });
    };

    logout: RequestHandler = async (req, res) => {
        const refreshToken: string = res.locals.refreshToken;
        const payload = res.locals.refreshPayload as RefreshPayload;

        await this.tokenBlacklistService.addRefTokenToBlacklist(
            refreshToken,
            payload.exp!,
        );
        await this.deviceSessionsService.deleteSession(
            payload.userId,
            payload.deviceId,
        );

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.sendStatus(HttpStatus.NoContent);
    };

    registration: RequestHandler<unknown, unknown, RegistrationAttributes> = async (
        req,
        res,
    ) => {
        try {
            await this.authService.registerMail(req.body);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            if (error instanceof RepositoryBadRequestError) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [
                        { message: error.message, field: error.field ?? '' },
                    ],
                });
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    registrationConfirmation: RequestHandler<unknown, unknown, { code: string }> = async (
        req,
        res,
    ) => {
        try {
            await this.authService.confirmByCode(req.body.code);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            if (error instanceof RepositoryBadRequestError) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [
                        { message: error.message, field: error.field ?? '' },
                    ],
                });
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    registrationResend: RequestHandler<unknown, unknown, { email: string }> = async (
        req,
        res,
    ) => {
        try {
            const userEmail = req.body.email.trim();
            const user = await this.authRepository.findUserByLoginOrEmail(userEmail);

            if (!user) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [{ message: 'User not found', field: 'email' }],
                });
                return;
            }

            if (user.emailConfirmation?.isConfirmed) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [{ message: 'Email already confirmed', field: 'email' }],
                });
                return;
            }

            await this.authService.resendingMail(userEmail);

            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            if (error instanceof RepositoryBadRequestError) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [
                        { message: error.message, field: error.field ?? '' },
                    ],
                });
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    currentUser: RequestHandler = async (req, res) => {
        const currentUser = res.locals.currentUser!;
        res.status(HttpStatus.Ok).json({
            email: currentUser.email,
            login: currentUser.login,
            userId: currentUser._id.toString(),
        });
    };

    emailPasswordRecovery: RequestHandler = async (req, res, next) => {
        try {
            await this.authService.emailPasswordRecovery(req.body);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            next(error);
        }
    };

    emailNewPassword: RequestHandler = async (req, res, next) => {
        try {
            await this.authService.newEmailPassword(req.body);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            if (error instanceof RepositoryBadRequestError) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: [
                        { message: error.message, field: error.field ?? 'recoveryCode' },
                    ],
                });
                return;
            }
            next(error);
        }
    };
}
