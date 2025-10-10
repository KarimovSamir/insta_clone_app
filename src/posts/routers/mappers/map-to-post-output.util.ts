import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { ResourceType } from "../../../core/types/resource-type";
import { PostOutput } from "../output/post.output";

export function mapToPostOutputUtil (post: WithId<Post>): PostOutput{
    return {
        data: {
            type: ResourceType.Posts,
            id: post._id.toString(),
            attributes: {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            },   
        },
    };
}