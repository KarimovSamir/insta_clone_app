import { body } from 'express-validator';
import { dataIdMatchValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';
import { ResourceType } from '../../core/types/resource-type';

const nameValidation = body('data.attributes.name')
    .exists()
    .withMessage('name is required')
    .bail()

    .isString()
    .withMessage('name should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('name must not be empty')
    .bail()
    
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of name is not correct');

const descriptionValidation = body('data.attributes.description')
    .exists()
    .withMessage('description is required')
    .bail()

    .isString()
    .withMessage('description should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('description must not be empty')
    .bail()
    
    .isLength({ min: 2, max: 500 })
    .withMessage('Length of description is not correct');

const websiteUrlValidation = body('data.attributes.websiteUrl')
    .exists()
    .withMessage('websiteUrl is required')
    .bail()

    .isString()
    .withMessage('websiteUrl should be string')
    .bail()

    .trim()

    .notEmpty()
    .withMessage('websiteUrl must not be empty')
    .bail()
    
    .isLength({ min: 2, max: 100 })
    .withMessage('Length of websiteUrl is not correct')
    .bail()

    .isURL()
    .withMessage('Invalid URL format. Ex: https://test.com');

export const blogCreateInputValidation = [
  resourceTypeValidation(ResourceType.Blogs),
  nameValidation,
  descriptionValidation,
  websiteUrlValidation
];

export const blogUpdateInputValidation = [
  resourceTypeValidation(ResourceType.Blogs),
  dataIdMatchValidation,
  nameValidation,
  descriptionValidation,
  websiteUrlValidation
];