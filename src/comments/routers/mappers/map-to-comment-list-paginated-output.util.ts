import { WithId } from "mongodb";
import { CommentListPaginatedOutput } from "../output/comment-list-paginated.output";
import { Comment, enumCommentLikeDislikeStatus } from "../../domain/comment";

export function mapToCommentListPaginatedOutput(
    comments: WithId<Comment>[],
    // 1. Мы принимаем "Словарь".
    // Record<string, ...> означает объект, где ключ - это строка (ID коммента), 
    // а значение - это статус (Like/Dislike).
    myStatusesDictionary: Record<string, enumCommentLikeDislikeStatus>,
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): CommentListPaginatedOutput {
    return {
        pagesCount: meta.pageSize
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: comments.map((comment) => {
            const commentId = comment._id.toString();
            // 3. Заглядываем в "Шпаргалку" (Словарь).
            // Мы говорим: "Дай мне статус для этого commentId".
            const status = myStatusesDictionary[commentId] ?? enumCommentLikeDislikeStatus.None;
            // 4. Возвращаем готовый объект
            return {
                id: commentId,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin,
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount,
                    myStatus: status, 
                },
            };
        }),
    };
}
