import { PostAttributes } from "../../application/dtos/post-attributes";

export type PostCreateInput = PostAttributes;

export type PostCreateByBlogInput = Omit<PostAttributes, "blogId">;
