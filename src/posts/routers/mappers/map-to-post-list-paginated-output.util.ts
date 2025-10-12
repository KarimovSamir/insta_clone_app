import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostListPaginatedOutput } from "../output/post-list-paginated.output";
import { ResourceType } from "../../../core/types/resource-type";

export function mapToPostListPaginatedOutput (
    posts: WithId<Post>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
): PostListPaginatedOutput {
    return {
        pagesCount: meta.pageSize ? Math.ceil(meta.totalCount / meta.pageSize) : 0,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post) => ({
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        })),
    };
}
