import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogByIdHandler } from "./handlers/get-blog-by-id.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogByIdHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { blogInputDtoValidation } from "../validation/blog.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const blogRouter = Router();

// blogRouter.use(superAdminGuardMiddleware);

blogRouter
    .get('', getBlogListHandler)
    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogByIdHandler)
    .post('/', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)
    .put('/:id', superAdminGuardMiddleware, idValidation, blogInputDtoValidation, inputValidationResultMiddleware, updateBlogByIdHandler)
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deleteBlogHandler)