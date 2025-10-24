import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputValidation, authRegistrationValidation } from './auth.input-dto.validation-middlewares';
import { bearerAuthGuard } from '../middlewares/bearer-auth.guard-middleware';
import { currentUserHandler } from './handlers/current-user.handler';
import { registrationMailHandler } from './handlers/registration-mail.handler';
import { registrationConfirmationHandler } from './handlers/registration-confirmation.handler';

export const authRouter = Router({});

authRouter.post(
    '/login',
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler,
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

authRouter.get(
    '/me',
    bearerAuthGuard,
    currentUserHandler,
);