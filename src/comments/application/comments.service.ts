import { WithId } from "mongodb";
import { postsRepository } from "../../posts/repositories/post.repository";
import { Comment } from "../domain/comment";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { commentsRepository } from "../repositories/comment.repository";
import { CommentAttributes } from "./dtos/comment-attributes";
type CurrentUser = { _id: any; login: string; email: string; createdAt: string };

export const commentsService = {
    async findCommentsByPost(
        queryDto: CommentQueryInput,
        postId: string,
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        await postsRepository.findPostByIdOrFail(postId);

        return commentsRepository.findCommentsByPost(queryDto, postId);
    },

    async findCommentByIdOrFail(id: string): Promise<WithId<Comment>> {
        return commentsRepository.findCommentByIdOrFail(id);
    },

    async createCommentWithUrlPostId (
        postIdUrl:string, 
        dto: CommentAttributes,
        user: CurrentUser
    ): Promise<string> {
        const post = await postsRepository.findPostByIdOrFail(postIdUrl);

        const newComment: Comment = {
            postId: post._id.toString(),
            content: dto.content,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        }

        return await commentsRepository.createComment(newComment);;
    },

    async deleteComment(id: string): Promise <void> {
        await commentsRepository.deleteCommentById(id);
        return;
    },

    async updateComment(id: string, dto: CommentAttributes): Promise <void> {
        await commentsRepository.updateCommentById(id, dto);
        return;
    },
}