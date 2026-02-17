import { Router } from "express";
import { query } from "express-validator";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { BlogSortField } from "./input/blog-sort-field";
import {
    blogCreateInputValidation,
    blogUpdateInputValidation,
} from "./blog.input-dto.validation-middlewares";
import { PostSortField } from "../../posts/routers/input/post-sort-field";
import { postCreateByBlogInputDtoValidation } from "../../posts/routers/post.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { BlogController } from "../controllers/blog.controller";

const blogController = appContainer.get<BlogController>(TYPES.BlogController);

export const blogRouter = Router({});

blogRouter
    .get(
        "",
        query("searchNameTerm").optional({ values: "falsy" }).isString().trim(),
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        blogController.getBlogList,
    )

    .get(
        "/:id",
        idValidation,
        inputValidationResultMiddleware,
        blogController.getBlogById,
    )

    .post(
        "",
        superAdminGuardMiddleware,
        blogCreateInputValidation,
        inputValidationResultMiddleware,
        blogController.createBlog,
    )

    .put(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        blogUpdateInputValidation,
        inputValidationResultMiddleware,
        blogController.updateBlogById,
    )

    .delete(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        blogController.deleteBlogById,
    )

    .post(
        "/:id/posts",
        superAdminGuardMiddleware,
        idValidation,
        postCreateByBlogInputDtoValidation,
        inputValidationResultMiddleware,
        blogController.createBlogPost,
    )

    .get(
        "/:id/posts",
        idValidation,
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        blogController.getBlogPostList,
    );
