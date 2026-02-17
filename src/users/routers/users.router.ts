import { Router } from "express";
import { query } from "express-validator";
import { appContainer } from "../../core/ioc/app.container";
import { TYPES } from "../../core/ioc/types";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { UsersController } from "../controllers/users.controller";
import { UserSortField } from "./input/user-sort-field";
import { userCreateInputValidation } from "./user.input-dto.validation-middlewares";

export const userRouter = Router({});

const usersController = appContainer.get<UsersController>(
    TYPES.UsersController,
);

userRouter
    .get(
        "",
        superAdminGuardMiddleware,
        query("searchLoginTerm")
            .optional({ values: "falsy" })
            .isString()
            .trim(),
        query("searchEmailTerm")
            .optional({ values: "falsy" })
            .isString()
            .trim(),
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        usersController.getUserList,
    )

    .post(
        "",
        superAdminGuardMiddleware,
        userCreateInputValidation,
        inputValidationResultMiddleware,
        usersController.createUser,
    )

    .delete(
        "/:id",
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        usersController.deleteUserById,
    );
