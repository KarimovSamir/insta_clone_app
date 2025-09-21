import { param } from "express-validator";

export const idValidation = param('id')
    .exists()
    .withMessage('id is required')
    .bail()

    .isString()
    .withMessage('id must be a string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('id must not be empty')
    .bail()

    .matches(/^\d+$/)
    .withMessage('id must contain only digits');