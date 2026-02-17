// входные атрибуты для создания/обновления

import { enumCommentLikeDislikeStatus } from "../../domain/comment";

export type CommentLikeDislikeStatusAttributes = {
    likeStatus: enumCommentLikeDislikeStatus;
};