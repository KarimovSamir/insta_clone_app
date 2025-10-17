import { Router } from 'express';
import { loginHandler } from './handlers/login.handler';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { authInputValidation } from './auth.input-dto.validation-middlewares';

export const authRouter = Router({});

authRouter.post(
    '/login',
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler,
);