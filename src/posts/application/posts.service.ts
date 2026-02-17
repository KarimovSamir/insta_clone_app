import { inject, injectable } from "inversify";
import { WithId } from "mongodb";
import { TYPES } from "../../core/ioc/types";
import { BlogRepository } from "../../blogs/repositories/blog.repository";
import { PostRepository } from "../repositories/post.repository";
import { Post } from "../domain/post";
import { PostQueryInput } from "../routers/input/post-query.input";
import { PostAttributes } from "./dtos/post-attributes";
import { PostLikeRepository } from "../repositories/post.likes.repository";
import { enumPostLikeStatus, NewestLikes } from "../domain/post.likes";

@injectable()
export class PostsService {
    constructor(
        @inject(TYPES.PostRepository)
        private readonly postsRepository: PostRepository,
        @inject(TYPES.BlogRepository)
        private readonly blogsRepository: BlogRepository,
        @inject(TYPES.PostLikeRepository)
        private readonly postLikeRepository: PostLikeRepository,
    ) { }

    async findPosts(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        return this.postsRepository.findPosts(queryDto);
    }

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        await this.blogsRepository.findBlogByIdOrFail(blogId);

        return this.postsRepository.findPostsByBlog(queryDto, blogId);
    }

    async findPostByIdOrFail(id: string): Promise<WithId<Post>> {
        return this.postsRepository.findPostByIdOrFail(id);
    }

    async getPostResultById(
        postId: string,
        userId?: string,
    ): Promise<{
        post: WithId<Post>;
        myStatus: enumPostLikeStatus;
        newestLikes: NewestLikes[];
    }> {
        const post = await this.postsRepository.findPostByIdOrFail(postId);
        let myStatus = enumPostLikeStatus.None;

        if (userId) {
            const likeStatus =
                await this.postLikeRepository.findByPostIdAndUserId(
                    postId,
                    userId,
                );
            if (likeStatus) {
                myStatus = likeStatus.status;
            }
        }

        const newestLikesDB = await this.postLikeRepository.findNewestLikes(postId)

        const newestLikes: NewestLikes[] = newestLikesDB.map((like) => ({
            addedAt: like.addedAt,
            userId: like.userId,
            login: like.userLogin,
        }));

        return { post, myStatus, newestLikes };
    }

    async createPost(dto: PostAttributes): Promise<string> {
        const blog = await this.blogsRepository.findBlogByIdOrFail(dto.blogId);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        return await this.postsRepository.createPost(newPost);
    }

    async createPostWithUrlBlogId(
        blogIdUrl: string,
        dto: PostAttributes,
    ): Promise<string> {
        const blog = await this.blogsRepository.findBlogByIdOrFail(blogIdUrl);

        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogIdUrl,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        return await this.postsRepository.createPost(newPost);
    }

    async updatePostById(id: string, dto: PostAttributes): Promise<void> {
        await this.postsRepository.updatePostById(id, dto);
    }

    async deletePostById(id: string): Promise<void> {
        await this.postsRepository.deletePostById(id);
    }
}
