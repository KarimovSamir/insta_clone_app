import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { getCommentHandler } from "./handlers/get-comment-by-id.handler";
import { bearerAuthGuard } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { updateCommentByIdInputDtoValidation } from "./comment.input-dto.validation-middlewares";
import { updateCommentByIdHandler } from "./handlers/update-comment.handler";
import { deleteCommentHandler } from "./handlers/delete-blog.handler";

export const commentRouter = Router({});

commentRouter
    .get(
        '/:id', 
        idValidation, 
        inputValidationResultMiddleware, 
        getCommentHandler,
    )

    .put(
        '/:id', 
        bearerAuthGuard,
        idValidation, 
        updateCommentByIdInputDtoValidation, 
        inputValidationResultMiddleware, 
        updateCommentByIdHandler,
    )

    .delete(
        '/:id', 
        bearerAuthGuard,
        idValidation, 
        inputValidationResultMiddleware, 
        deleteCommentHandler,
    )