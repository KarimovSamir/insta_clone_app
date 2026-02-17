import { WithId } from "mongodb";
import { CommentListPaginatedOutput } from "../output/comment-list-paginated.output";
import { Comment, enumCommentLikeDislikeStatus } from "../../domain/comment";

export function mapToCommentListPaginatedOutput(
    comments: WithId<Comment>[],
    // myStatus: enumCommentLikeDislikeStatus,
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentListPaginatedOutput {
    return {
        pagesCount: meta.pageSize
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: comments.map((comment) => ({
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: enumCommentLikeDislikeStatus.None,
            },
        })),
    };
}
