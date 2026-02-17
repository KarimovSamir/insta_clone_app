import { Router } from "express";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { bearerAuthGuard } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { createPostCommentByIdInputDtoValidation } from "../../comments/routers/comment.input-dto.validation-middlewares";
import { CommentSortField } from "../../comments/routers/input/comment-sort-field";
import { PostsController } from "../controllers/posts.controller";
import { PostSortField } from "./input/post-sort-field";
import {
    postCreateInputDtoValidation,
    postUpdateInputDtoValidation,
} from "./post.input-dto.validation-middlewares";
import { softBearerAuthGuard } from "../../auth/middlewares/soft-bearer-auth.guard-middleware";

export const postRouter = Router({});

const postsController = appContainer.get<PostsController>(
    TYPES.PostsController,
);

postRouter
    .get(
        "",
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        postsController.getPostList,
    )

    .get(
        "/:id",
        softBearerAuthGuard,
        idValidation,
        inputValidationResultMiddleware,
        postsController.getPostById,
    )

    .get(
        "/:id/comments",
        softBearerAuthGuard,
        idValidation,
        paginationAndSortingValidation(CommentSortField),
        inputValidationResultMiddleware,
        postsController.getPostComments,
    )

    .put(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        postUpdateInputDtoValidation,
        inputValidationResultMiddleware,
        postsController.updatePostById,
    )
    
    .delete(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        postsController.deletePostById,
    )
    
    .post(
        "",
        superAdminGuardMiddleware,
        postCreateInputDtoValidation,
        inputValidationResultMiddleware,
        postsController.createPost,
    )

    .post(
        "/:id/comments",
        bearerAuthGuard,
        idValidation,
        createPostCommentByIdInputDtoValidation,
        inputValidationResultMiddleware,
        postsController.createPostComment,
    );