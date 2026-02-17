import { injectable } from "inversify";
import { commentLikeDislikeStatusCollection } from "../../db/mongo.db";
import {
    CommentLikeDislikeStatus,
    enumCommentLikeDislikeStatus,
} from "../domain/comment";
import { WithId } from "mongodb";

@injectable()
export class CommentLikeDislikeRepository {
    async findByUserIdAndCommentId(
        userId: string,
        commentId: string,
    ): Promise<CommentLikeDislikeStatus | null> {
        const res = await commentLikeDislikeStatusCollection.findOne({
            userId: userId,
            commentId: commentId,
        });
        return res;
    }

    // Метод для массового поиска
    async findStatusesForComments(userId: string, commentIds: string[]): Promise<WithId<CommentLikeDislikeStatus>[]> {
        return commentLikeDislikeStatusCollection
            .find({
                userId: userId,
                commentId: { $in: commentIds } // Ищем любой из списка
            })
            .toArray();
    }

    async saveStatusCommentLikeDislike(
        userId: string,
        commentId: string,
        status: enumCommentLikeDislikeStatus,
    ): Promise<void> {
        await commentLikeDislikeStatusCollection.updateOne(
            {
                userId: userId,
                commentId: commentId,
            },
            {
                $set: {
                    status: status,
                    createdAt: new Date().toISOString(),
                },
            },
            { upsert: true },
            // Команда upsert
            // 1. Ищет запись по userId и commentId.
            // 2. Если нашел -> меняет status.
            // 3. Если НЕ нашел -> создает новую запись с этим status.
        );
    }
}
