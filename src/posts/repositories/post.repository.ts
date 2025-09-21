import { db } from "../../db/in-memory.db";
import { PostInputDto } from "../dto/post.input-dto";
import { Post } from "../types/post";

export const postsRepository = {
    findPosts(): Post[] {
        return db.posts;
    },

    findPostById(id: string): Post | null {
        const postById = db.posts.find((v) => v.id === id) ?? null;
        return postById
    },

    createPost(newPost: Post): Post{
        db.posts.push(newPost);
        return newPost;
    },

    updatePostById (id: string, dto: PostInputDto): void {
        const post = db.posts.find((v) => v.id === id) ?? null

        if (!post) {
            throw new Error('Post not exist');
        }

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId;
        post.blogName = dto.blogName;

        return;
    },

    deletePostById(id: string): void{
        const index = db.posts.findIndex((v) => v.id === id);

        if (index === -1) {
            throw new Error('Post not exist');
        }

        db.posts.splice(index, 1);
        return;
    },
}