import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputValidation } from './auth.input-dto.validation-middlewares';
import { bearerAuthGuard } from '../middlewares/bearer-auth.guard-middleware';
import { currentUserHandler } from './handlers/current-user.handler';

export const authRouter = Router({});

authRouter.post(
    '/login',
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler,
);

authRouter.get(
    '/me',
    bearerAuthGuard,
    currentUserHandler,
);