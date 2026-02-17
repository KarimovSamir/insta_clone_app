import { CommentAttributes } from "../../application/dtos/comment-attributes";

export type CommentCreateInput = CommentAttributes;

export type CommentCreateByIdInput = Omit<CommentAttributes, "postId">;
