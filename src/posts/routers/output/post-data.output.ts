import { ExtendedLikesInfo } from "../../domain/post.likes";

export type PostDataOutput = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo; 
};