import { body } from 'express-validator';
import { db } from '../../db/in-memory.db';

const titleValidation = body('title')
    .exists()
    .withMessage('Title is required')
    .bail()

    .isString()
    .withMessage('Title should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('Title must not be empty')
    .bail()
    
    .isLength({ min: 2, max: 30 })
    .withMessage('Length of title is not correct');

const shortDescriptionValidation = body('shortDescription')
    .exists()
    .withMessage('shortDescription is required')
    .bail()

    .isString()
    .withMessage('shortDescription should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('shortDescription must not be empty')
    .bail()

    .isLength({ min: 2, max: 100 })
    .withMessage('Length of shortDescription is not correct');

const contentValidation = body('content')
    .exists()
    .withMessage('content is required')
    .bail()

    .isString()
    .withMessage('content should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('content must not be empty')
    .bail()

    .isLength({ min: 2, max: 1000 })
    .withMessage('Length of content is not correct');

const blogId = body('blogId')
    .exists()
    .withMessage('blogId is required')
    .bail()

    .isString()
    .withMessage('blogId must be a string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('blogId must not be empty')
    .bail()

    .matches(/^\d+$/)
    .withMessage('blogId must contain only digits')
    .bail()
    
    .custom((value) => {
    const exists = db.blogs.some(b => b.id === value);
    if (!exists) throw new Error('blogId does not exist');
        return true;
    });


export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogId
];