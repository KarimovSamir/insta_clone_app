import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog-by-id.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogByIdHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { BlogSortField } from "./input/blog-sort-field";
import { blogCreateInputValidation, blogUpdateInputValidation } from "./blog.input-dto.validation-middlewares";
import { getBlogPostListHandler } from "./handlers/get-blog-post-list.handler";

export const blogRouter = Router({});

// blogRouter.use(superAdminGuardMiddleware);

blogRouter
    .get(
        '', 
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogListHandler,
    )

    .get(
        '/:id', 
        idValidation, 
        inputValidationResultMiddleware, 
        getBlogHandler,
    )

    .post(
        '', 
        superAdminGuardMiddleware,
        blogCreateInputValidation, 
        inputValidationResultMiddleware, 
        createBlogHandler,
    )

    .put(
        '/:id', 
        superAdminGuardMiddleware,
        idValidation, 
        blogUpdateInputValidation, 
        inputValidationResultMiddleware, 
        updateBlogByIdHandler,
    )

    .delete(
        '/:id', 
        superAdminGuardMiddleware,
        idValidation, 
        inputValidationResultMiddleware, 
        deleteBlogHandler,
    )

    .get(
        '/:id/posts',
        idValidation,
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogPostListHandler,
    );