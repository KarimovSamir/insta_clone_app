import { body } from "express-validator";

const nameValidation = body("name")
    .exists()
    .withMessage("name is required")
    .bail()

    .isString()
    .withMessage("name should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("name must not be empty")
    .bail()

    .isLength({ min: 2, max: 15 })
    .withMessage("Length of name is not correct");

const descriptionValidation = body("description")
    .exists()
    .withMessage("description is required")
    .bail()

    .isString()
    .withMessage("description should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("description must not be empty")
    .bail()

    .isLength({ min: 2, max: 500 })
    .withMessage("Length of description is not correct");

const websiteUrlValidation = body("websiteUrl")
    .exists()
    .withMessage("websiteUrl is required")
    .bail()

    .isString()
    .withMessage("websiteUrl should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("websiteUrl must not be empty")
    .bail()

    .isLength({ min: 2, max: 100 })
    .withMessage("Length of websiteUrl is not correct")
    .bail()

    .isURL()
    .withMessage("Invalid URL format. Ex: https://test.com");

export const blogCreateInputValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
];

export const blogUpdateInputValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
];
