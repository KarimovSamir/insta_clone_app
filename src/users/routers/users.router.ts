import { Router } from "express";
import { query } from "express-validator";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { UserSortField } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { getUserListHandler } from "./handlers/get-user-list.handler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { userCreateInputValidation } from "./user.input-dto.validation-middlewares";
import { createUserHandler } from "./handlers/create-user.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { deleteUserHandler } from "./handlers/delete-user.handler";

export const userRouter = Router({});

userRouter
    .get(
        '',
        superAdminGuardMiddleware,
        query('searchLoginTerm')
            .optional({ values: 'falsy' })
            .isString()
            .trim(),
        query('searchEmailTerm')
            .optional({ values: 'falsy' })
            .isString()
            .trim(),
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        getUserListHandler,
    )

    .post(
        '',
        superAdminGuardMiddleware,
        userCreateInputValidation,
        inputValidationResultMiddleware,
        createUserHandler,
    )

    .delete(
        '/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteUserHandler,
    );