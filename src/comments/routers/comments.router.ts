import { Router } from "express";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { bearerAuthGuard } from "../../auth/middlewares/bearer-auth.guard-middleware";
import {
    updateCommentByIdInputDtoValidation,
    updateLikeStatusInputDtoValidation,
} from "./comment.input-dto.validation-middlewares";
import { CommentsController } from "../controllers/comments.controller";
import { softBearerAuthGuard } from "../../auth/middlewares/soft-bearer-auth.guard-middleware";

export const commentRouter = Router({});

const commentsController = appContainer.get<CommentsController>(
    TYPES.CommentsController,
);

commentRouter
    .get(
        "/:id",
        softBearerAuthGuard,
        idValidation,
        inputValidationResultMiddleware,
        commentsController.getCommentById,
    )

    .put(
        "/:id",
        bearerAuthGuard,
        idValidation,
        updateCommentByIdInputDtoValidation,
        inputValidationResultMiddleware,
        commentsController.updateCommentById,
    )

    .put(
        "/:id/like-status",
        bearerAuthGuard,
        idValidation,
        updateLikeStatusInputDtoValidation,
        inputValidationResultMiddleware,
        commentsController.updateLikeStatusById,
    )

    .delete(
        "/:id",
        bearerAuthGuard,
        idValidation,
        inputValidationResultMiddleware,
        commentsController.deleteCommentById,
    );
