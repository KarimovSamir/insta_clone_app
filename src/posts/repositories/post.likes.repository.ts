import { injectable } from "inversify";
import { WithId } from "mongodb";
import { postLikeStatusCollection } from "../../db/mongo.db";
import { enumPostLikeStatus, PostLikeStatus } from "../domain/post.likes";

@injectable()
export class PostLikeRepository {
    async findNewestLikes(postId: string): Promise<WithId<PostLikeStatus>[]> {
        return postLikeStatusCollection
            .find({
                postId: postId,
                status: enumPostLikeStatus.Like
            })
            .sort({ addedAt: -1 }) // Сортировка для последних
            .limit(3)
            .toArray();
    }

    // Метод для одного поиска
    async findByPostIdAndUserId(postId: string, userId: string): Promise<WithId<PostLikeStatus> | null> {
        return postLikeStatusCollection.findOne({ postId, userId });
    }

    // Метод для массового поиска
    async findStatusesForPosts(userId: string, postsIds: string[]): Promise<WithId<PostLikeStatus>[]> {
        return postLikeStatusCollection
            .find({
                userId: userId,
                postId: { $in: postsIds } // Ищем любой из списка
            })
            .toArray();
    }

    async saveStatusPostLike(
        userId: string,
        postId: string,
        userLogin: string,
        status: enumPostLikeStatus,
    ): Promise<void> {
        await postLikeStatusCollection.updateOne(
            {
                userId: userId,
                postId: postId,
            },
            {
                $set: {
                    userLogin: userLogin,
                    status: status,
                    addedAt: new Date().toISOString(),
                },
            },
            { upsert: true },
            // Команда upsert
            // 1. Ищет запись по userId и postId.
            // 2. Если нашел -> меняет status.
            // 3. Если НЕ нашел -> создает новую запись с этим status.
        );
    }

    // Считаем лайки
    async countLikes(postId: string): Promise<number> {
        return postLikeStatusCollection.countDocuments({ postId, status: enumPostLikeStatus.Like });
    }

    // Считаем дизлайки
    async countDislikes(postId: string): Promise<number> {
        return postLikeStatusCollection.countDocuments({ postId, status: enumPostLikeStatus.Dislike });
    }
}
