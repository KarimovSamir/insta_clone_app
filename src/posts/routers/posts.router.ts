import { Router } from "express";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { getPostByIdHandler } from "./handlers/get-post-by-id.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostByIdHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { PostSortField } from "./input/post-sort-field";
import { postCreateInputDtoValidation, postUpdateInputDtoValidation } from "./post.input-dto.validation-middlewares";
import { createPostCommentByIdHandler } from "./handlers/create-post-comment-by-id.handler";
import { bearerAuthGuard } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { createPostCommentByIdInputDtoValidation } from "../../comments/routers/comment.input-dto.validation-middlewares";
import { getPostAllCommentsByIdHandler } from "./handlers/get-post-allComments-by-postId.handler";
import { CommentSortField } from "../../comments/routers/input/comment-sort-field";

export const postRouter = Router({});

// postRouter.use(superAdminGuardMiddleware);

postRouter
    .get(
        '', 
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getPostListHandler,
    )

    .get(
        '/:id', 
        idValidation, 
        inputValidationResultMiddleware, 
        getPostByIdHandler,
    )

    .post(
        '', 
        superAdminGuardMiddleware,
        postCreateInputDtoValidation, 
        inputValidationResultMiddleware, 
        createPostHandler,
    )

    .put(
        '/:id', 
        superAdminGuardMiddleware,
        idValidation, 
        postUpdateInputDtoValidation, 
        inputValidationResultMiddleware, 
        updatePostByIdHandler,
    )

    .delete(
        '/:id', 
        superAdminGuardMiddleware,
        idValidation, 
        inputValidationResultMiddleware, 
        deletePostHandler,
    )

    .post(
        '/:id/comments', 
        bearerAuthGuard,
        idValidation, 
        createPostCommentByIdInputDtoValidation,
        inputValidationResultMiddleware, 
        createPostCommentByIdHandler,
    )

    .get(
        '/:id/comments', 
        idValidation, 
        paginationAndSortingValidation(CommentSortField),
        inputValidationResultMiddleware, 
        getPostAllCommentsByIdHandler,
    )