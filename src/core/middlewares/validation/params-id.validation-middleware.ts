import { body, param } from "express-validator";

export const idValidation = param("id")
    .exists()
    .withMessage("id is required")
    .bail()

    .isString()
    .withMessage("id must be a string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("id must not be empty")
    .bail()

    .isMongoId()
    .withMessage("Incorrect format of ObjectId");

export const dataIdMatchValidation = body("data.id")
    .exists()
    .withMessage("ID in body is required")
    .custom((value, { req }) => {
        if (value !== req?.params?.id) {
            throw new Error("ID in URL and body must match");
        }
        return true; // Если все хорошо, возвращаем true
    });
