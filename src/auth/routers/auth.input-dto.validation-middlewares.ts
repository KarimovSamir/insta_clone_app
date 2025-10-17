import { body } from 'express-validator';

const loginOrEmailValidation = body('loginOrEmail')
  .exists()
  .withMessage('loginOrEmail is required')
  .bail()

  .isString()
  .withMessage('loginOrEmail should be string')
  .bail()

  .trim()

  .notEmpty()
  .withMessage('loginOrEmail must not be empty');

const passwordValidation = body('password')
  .exists()
  .withMessage('password is required')
  .bail()

  .isString()
  .withMessage('password should be string')
  .bail()

  .trim()

  .notEmpty()
  .withMessage('password must not be empty')
  .bail()

  .isLength({ min: 6, max: 20 })
  .withMessage('Length of password is not correct');

export const authInputValidation = [
  loginOrEmailValidation,
  passwordValidation,
];