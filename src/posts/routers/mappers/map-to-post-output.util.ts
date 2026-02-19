import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostOutput } from "../output/post.output";
// Не забудь импорты!
import { enumPostLikeStatus, NewestLikes } from "../../domain/post.likes";

export function mapToPostOutputUtil(
    post: WithId<Post>,
    // Принимаем новые аргументы. Если их не передали (например, при создании), ставим дефолтные.
    myStatus: enumPostLikeStatus = enumPostLikeStatus.None,
    newestLikes: NewestLikes[] = []
): PostOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            // Если в базе у старых постов еще нет объекта likesInfo, возвращаем 0
            likesCount: post.likesInfo?.likesCount || 0,
            dislikesCount: post.likesInfo?.dislikesCount || 0,
            myStatus: myStatus,
            newestLikes: newestLikes,
        },
    };
}