import { Router } from 'express';
import { appContainer } from '../../core/ioc/app.container';
import { TYPES } from '../../core/ioc/types';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { bearerAuthGuard } from '../../auth/middlewares/bearer-auth.guard-middleware';
import { updateCommentByIdInputDtoValidation } from './comment.input-dto.validation-middlewares';
import { CommentsController } from '../controllers/comments.controller';

export const commentRouter = Router({});

const commentsController = appContainer.get<CommentsController>(
  TYPES.CommentsController,
);

commentRouter
    .get(
        '/:id',
        idValidation,
        inputValidationResultMiddleware,
        commentsController.getCommentById,
    )

    .put(
        '/:id',
        bearerAuthGuard,
        idValidation,
        updateCommentByIdInputDtoValidation,
        inputValidationResultMiddleware,
        commentsController.updateCommentById,
    )

    .delete(
        '/:id',
        bearerAuthGuard,
        idValidation,
        inputValidationResultMiddleware,
        commentsController.deleteCommentById,
    )