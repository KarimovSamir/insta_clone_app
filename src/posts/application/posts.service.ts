import { Post } from "../domain/post";
import { WithId } from "mongodb";
import { PostQueryInput } from "../routers/input/post-query.input";
import { blogsRepository } from "../../blogs/repositories/blog.repository";
import { postsRepository } from "../repositories/post.repository";
import { PostAttributes } from "./dtos/post-attributes";

export const postsService = {
    async findPosts(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return postsRepository.findPosts(queryDto);
    },

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        await blogsRepository.findBlogByIdOrFail(blogId);

        return postsRepository.findPostsByBlog(queryDto, blogId);
    },

    async findPostByIdOrFail(id: string): Promise<WithId<Post>> {
        return postsRepository.findPostByIdOrFail(id);
    },

    async createPost(dto: PostAttributes): Promise<string>{
        const blog = await blogsRepository.findBlogByIdOrFail(dto.blogId);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        return await postsRepository.createPost(newPost);
    },

    async createPostWithUrlBlogId(blogIdUrl:string, dto: PostAttributes): Promise<string> {
        const blog = await blogsRepository.findBlogByIdOrFail(blogIdUrl);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogIdUrl,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        return await postsRepository.createPost(newPost);
    },

    async updatePostById (id: string, dto: PostAttributes): Promise<void> {
        await postsRepository.updatePostById(id, dto);
        return;
    },

    async deletePostById(id: string): Promise<void>{
        await postsRepository.deletePostById(id);
        return;
    },
}