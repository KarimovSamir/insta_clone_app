import { inject, injectable } from "inversify";
import { WithId } from "mongodb";
import { TYPES } from "../../core/ioc/types";
import { RepositoryForbiddenError } from "../../core/errors/repository-forbidden.error";
import { PostsService } from "../../posts/application/posts.service";
import { CommentRepository } from "../repositories/comment.repository";
import { Comment, enumCommentLikeDislikeStatus } from "../domain/comment";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { CommentAttributes } from "./dtos/comment-attributes";
import { CommentLikeDislikeRepository } from "../repositories/comment.like-dislike.repository";
import { CommentLikeDislikeStatusAttributes } from "./dtos/comment-like-dilsike-status-attributes";

type CurrentUser = {
    _id: any;
    login: string;
    email: string;
    createdAt: string;
};

@injectable()
export class CommentsService {
    constructor(
        @inject(TYPES.CommentRepository)
        private readonly commentsRepository: CommentRepository,
        @inject(TYPES.PostsService)
        private readonly postsService: PostsService,
        @inject(TYPES.CommentLikeStatusRepository)
        private readonly commentLikeStatusRepository: CommentLikeDislikeRepository,
    ) {}

    async findCommentsByPost(
        queryDto: CommentQueryInput,
        postId: string,
        userId?: string
    ): Promise<{ 
        items: WithId<Comment>[]; 
        totalCount: number; 
        myStatusesDictionary: Record<string, enumCommentLikeDislikeStatus> 
    }> {
        await this.postsService.findPostByIdOrFail(postId);
        const { items, totalCount } = await this.commentsRepository.findCommentsByPost(queryDto, postId);
        // Получаем статусы
        const myStatusesDictionary: Record<string, enumCommentLikeDislikeStatus> = {};

        if (userId) {
            const commentId = items.map(c => c._id.toString());
            const statuses = await this.commentLikeStatusRepository.findStatusesForComments(userId, commentId);

            // Закидываем всё что нашли в словарь
            statuses.forEach(status => {
                myStatusesDictionary[status.commentId] = status.status;
            });
        }

        return { items, totalCount, myStatusesDictionary };
    }

    async findCommentByIdOrFail(id: string): Promise<WithId<Comment>> {
        return this.commentsRepository.findCommentByIdOrFail(id);
    }

    async getCommentResultById(
        id: string,
        userId?: string,
    ): Promise<{
        comment: WithId<Comment>;
        myStatus: enumCommentLikeDislikeStatus;
    }> {
        const comment = await this.commentsRepository.findCommentByIdOrFail(id);
        let myStatus = enumCommentLikeDislikeStatus.None;

        if (userId) {
            const likeStatus =
                await this.commentLikeStatusRepository.findByUserIdAndCommentId(
                    userId,
                    id,
                );
            if (likeStatus) {
                myStatus = likeStatus.status;
            }
        }

        return { comment, myStatus };
    }

    async createCommentWithUrlPostId(
        postIdUrl: string,
        dto: CommentAttributes,
        user: CurrentUser,
    ): Promise<string> {
        const post = await this.postsService.findPostByIdOrFail(postIdUrl);

        const newComment: Comment = {
            postId: post._id.toString(),
            content: dto.content,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
        };

        return this.commentsRepository.createComment(newComment);
    }

    async deleteComment(id: string, user: CurrentUser): Promise<void> {
        const comment = await this.commentsRepository.findCommentByIdOrFail(id);
        if (comment.commentatorInfo.userId !== user._id.toString()) {
            throw new RepositoryForbiddenError(
                "You can delete only your own comments",
            );
        }
        await this.commentsRepository.deleteCommentById(id);
    }

    async updateComment(
        id: string,
        dto: CommentAttributes,
        user: CurrentUser,
    ): Promise<void> {
        const comment = await this.commentsRepository.findCommentByIdOrFail(id);
        if (comment.commentatorInfo.userId !== user._id.toString()) {
            throw new RepositoryForbiddenError(
                "You can update only your own comments",
            );
        }
        await this.commentsRepository.updateCommentById(id, dto);
    }

    async updateLikeStatus(
        id: string,
        dto: CommentLikeDislikeStatusAttributes,
        user: CurrentUser,
    ): Promise<void> {
        const comment = await this.commentsRepository.findCommentByIdOrFail(id);
        const likeStatusComment =
            await this.commentLikeStatusRepository.findByUserIdAndCommentId(
                user._id.toString(),
                id,
            );

        const currentStatus = likeStatusComment
            ? likeStatusComment.status
            : enumCommentLikeDislikeStatus.None;
        const newStatus = dto.likeStatus;

        if (currentStatus === newStatus) {
            return;
        }

        // если вдруг в базе пусто, то ставим 0
        let likesCount = comment.likesInfo?.likesCount || 0;
        let dislikesCount = comment.likesInfo?.dislikesCount || 0;

        if (currentStatus === enumCommentLikeDislikeStatus.Like) {
            likesCount--;
        } else if (currentStatus === enumCommentLikeDislikeStatus.Dislike) {
            dislikesCount--;
        }

        if (newStatus === enumCommentLikeDislikeStatus.Like) {
            likesCount++;
        } else if (newStatus === enumCommentLikeDislikeStatus.Dislike) {
            dislikesCount++;
        }

        // Защита чтобы счётчик не был минусом
        if (likesCount < 0) likesCount = 0;
        if (dislikesCount < 0) dislikesCount = 0;

        await Promise.all([
            // Обновляем личный статус юзера
            this.commentLikeStatusRepository.saveStatusCommentLikeDislike(
                user._id.toString(),
                id,
                newStatus,
            ),
            // Обновляем общие цифры в комментарии
            this.commentsRepository.updateCommentLikesInfo(
                id,
                likesCount,
                dislikesCount,
            ),
        ]);
    }
}
