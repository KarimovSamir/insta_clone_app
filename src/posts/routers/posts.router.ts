import { Router } from "express";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { getPostByIdHandler } from "./handlers/get-post-by-id.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostByIdHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { postInputDtoValidation } from "../validation/post.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

export const postRouter = Router();

postRouter
    .get('', getPostListHandler)
    .get('/:id', idValidation, inputValidationResultMiddleware, getPostByIdHandler)
    .post('/', superAdminGuardMiddleware, postInputDtoValidation, inputValidationResultMiddleware, createPostHandler)
    .put('/:id', superAdminGuardMiddleware, idValidation, postInputDtoValidation, inputValidationResultMiddleware, updatePostByIdHandler)
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePostHandler)