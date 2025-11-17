import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../core/ioc/types';
import { Blog } from '../domain/blog';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import { BlogRepository } from '../repositories/blog.repository';
import { BlogAttributes } from './dtos/blog-attributes';

export enum BlogErrorCode {
  HasActiveMembership = 'USER_HAS_ACTIVE_MEMBERSHIP',
}

@injectable()
export class BlogService {
  constructor(
    @inject(TYPES.BlogRepository)
    private readonly blogRepository: BlogRepository,
  ) {}

  async findBlogs(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return this.blogRepository.findBlogs(queryDto);
  }

  async findBlogByIdOrFail(id: string): Promise<WithId<Blog>> {
    return this.blogRepository.findBlogByIdOrFail(id);
  }

  async createBlog(dto: BlogAttributes): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return this.blogRepository.createBlog(newBlog);
  }

  async updateBlogById(id: string, dto: BlogAttributes): Promise<void> {
    await this.blogRepository.updateBlogById(id, dto);
  }

  async deleteBlogById(id: string): Promise<void> {
    await this.blogRepository.deleteBlogById(id);
  }
}
