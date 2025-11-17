import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../core/ioc/types';
import { BlogRepository } from '../../blogs/repositories/blog.repository';
import { PostRepository } from '../repositories/post.repository';
import { Post } from '../domain/post';
import { PostQueryInput } from '../routers/input/post-query.input';
import { PostAttributes } from './dtos/post-attributes';

@injectable()
export class PostsService {
  constructor(
    @inject(TYPES.PostRepository)
    private readonly postsRepository: PostRepository,
    @inject(TYPES.BlogRepository)
    private readonly blogsRepository: BlogRepository,
  ) {}

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

