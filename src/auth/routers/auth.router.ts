import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import {
  authInputValidation,
  authRegistrationValidation,
  emailConfirmationValidation,
} from './auth.input-dto.validation-middlewares';
import { bearerAuthGuard } from '../middlewares/bearer-auth.guard-middleware';
import { refreshTokenGuard } from '../middlewares/refresh-token.guard-middleware';
import { rateLimitAuthMiddleware } from '../middlewares/rate-limit-auth.middleware';
import { appContainer } from '../../core/ioc/app.container';
import { TYPES } from '../../core/ioc/types';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router({});

const authController = appContainer.get<AuthController>(TYPES.AuthController);

authRouter.post(
    '/login',
    rateLimitAuthMiddleware,
    authInputValidation,
    inputValidationResultMiddleware,
    authController.login,
);

authRouter.post(
    '/refresh-token',
    refreshTokenGuard,
    authController.refreshToken,
);

authRouter.post(
    '/logout',
    refreshTokenGuard,
    authController.logout,
);

authRouter.post(
    '/registration',
    rateLimitAuthMiddleware,
    authRegistrationValidation,
    inputValidationResultMiddleware,
    authController.registration,
);

authRouter.post(
    '/registration-confirmation',
    rateLimitAuthMiddleware,
    authController.registrationConfirmation,
);

authRouter.post(
    '/registration-email-resending',
    rateLimitAuthMiddleware,
    emailConfirmationValidation,
    inputValidationResultMiddleware,
    authController.registrationResend,
);

authRouter.get(
    '/me',
    bearerAuthGuard,
    authController.currentUser,
);