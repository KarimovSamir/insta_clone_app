import { body } from "express-validator";

const loginValidation = body("login")
    .exists()
    .withMessage("login is required")
    .bail()

    .isString()
    .withMessage("login should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("login must not be empty")
    .bail()

    .isLength({ min: 3, max: 10 })
    .withMessage("Length of login is not correct")

    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage(
        "login may contain only letters, numbers, underscore (_) and hyphen (-)",
    );

const passwordValidation = body("password")
    .exists()
    .withMessage("password is required")
    .bail()

    .isString()
    .withMessage("password should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("password must not be empty")
    .bail()

    .isLength({ min: 6, max: 20 })
    .withMessage("Length of password is not correct");

const emailUrlValidation = body("email")
    .exists()
    .withMessage("email is required")
    .bail()

    .isString()
    .withMessage("email should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("email must not be empty")
    .bail()

    .isEmail()
    .withMessage("Invalid email format");

// .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
// .withMessage('Invalid email format');

export const userCreateInputValidation = [
    loginValidation,
    passwordValidation,
    emailUrlValidation,
];

export const emailInputValidation = [emailUrlValidation];
