import { body } from 'express-validator';

const contentValidation = body('content')
    .exists()
    .withMessage('Content is required')
    .bail()

    .isString()
    .withMessage('Content should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('Content must not be empty')
    .bail()
    
    .isLength({ min: 20, max: 300 })
    .withMessage('Length of content is not correct');


export const createPostCommentByIdInputDtoValidation = [
    contentValidation,
];

export const updateCommentByIdInputDtoValidation = [
    contentValidation,
];