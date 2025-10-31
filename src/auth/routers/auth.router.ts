import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputValidation, authRegistrationValidation, emailConfirmationValidation } from './auth.input-dto.validation-middlewares';
import { bearerAuthGuard } from '../middlewares/bearer-auth.guard-middleware';
import { currentUserHandler } from './handlers/current-user.handler';
import { registrationMailHandler } from './handlers/registration-mail.handler';
import { registrationConfirmationHandler } from './handlers/registration-confirmation.handler';
import { registrationMailResendingHandler } from './handlers/registration-mail-resending.handler';
import { refreshTokenGuard } from '../middlewares/refresh-token.guard-middleware';
import { refreshTokenHandler } from './handlers/refresh-token.handler';
import { logoutHandler } from './handlers/logout.handler';

export const authRouter = Router({});

authRouter.post(
    '/login',
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler,
);

authRouter.post(
    '/refresh-token',
    refreshTokenGuard,
    refreshTokenHandler,
);

authRouter.post(
    '/logout',
    refreshTokenGuard,
    logoutHandler,
);

authRouter.post(
    '/registration',
    authRegistrationValidation,
    inputValidationResultMiddleware,
    registrationMailHandler,
);

authRouter.post(
    '/registration-confirmation', 
    registrationConfirmationHandler,
);

authRouter.post(
    '/registration-email-resending', 
    emailConfirmationValidation,
    inputValidationResultMiddleware,
    registrationMailResendingHandler,
);

authRouter.get(
    '/me',
    bearerAuthGuard,
    currentUserHandler,
);