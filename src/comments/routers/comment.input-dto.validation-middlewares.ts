import { body } from "express-validator";
import { enumCommentLikeDislikeStatus } from "../domain/comment";

const contentValidation = body("content")
    .exists()
    .withMessage("Content is required")
    .bail()

    .isString()
    .withMessage("Content should be string")
    .bail()

    .trim()

    .notEmpty()
    .withMessage("Content must not be empty")
    .bail()

    .isLength({ min: 20, max: 300 })
    .withMessage("Length of content is not correct");

export const likeStatusValidation = body("likeStatus")
    .isString()
    .withMessage("Like status must be a string")
    .trim()
    .isIn([
        enumCommentLikeDislikeStatus.None,
        enumCommentLikeDislikeStatus.Like,
        enumCommentLikeDislikeStatus.Dislike,
    ])
    .withMessage("Status must be None, Like or Dislike");

export const createPostCommentByIdInputDtoValidation = [contentValidation];

export const updateCommentByIdInputDtoValidation = [contentValidation];

export const updateLikeStatusInputDtoValidation = [likeStatusValidation];
