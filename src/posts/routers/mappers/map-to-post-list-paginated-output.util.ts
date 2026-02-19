import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";
import { enumPostLikeStatus, NewestLikes } from "../../domain/post.likes";

export function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],
    meta: { 
        pageNumber: number; 
        pageSize: number; 
        totalCount: number;
        // Указываем, что в meta теперь прилетают словари
        myStatusesDictionary: Record<string, enumPostLikeStatus>;
        newestLikesDictionary: Record<string, NewestLikes[]>;
    },
): PostListPaginatedOutput {
    return {
        pagesCount: meta.pageSize
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post) => {
            const postId = post._id.toString();
            const myStatus = meta.myStatusesDictionary[postId] || enumPostLikeStatus.None;
            const newestLikes = meta.newestLikesDictionary[postId] || [];

            return {
                id: postId,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesInfo?.likesCount || 0,
                    dislikesCount: post.likesInfo?.dislikesCount || 0,
                    myStatus: myStatus,
                    newestLikes: newestLikes,
                },
            };
        }),
    };
}