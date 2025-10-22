import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostOutput } from "../output/post.output";

export function mapToPostOutputUtil (post: WithId<Post>): PostOutput{
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt, 
    };
}