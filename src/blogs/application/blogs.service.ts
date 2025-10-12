import { Blog } from "../domain/blog";
import { WithId } from 'mongodb';
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { blogsRepository } from "../repositories/blog.repository";
import { BlogAttributes } from "./dtos/blog-attributes";

export enum BlogErrorCode{
    HasActiveMembership = 'USER_HAS_ACTIVE_MEMBERSHIP'
}

export const blogsService = {
    async findBlogs(
        queryDto: BlogQueryInput,
    ): Promise<{items: WithId<Blog>[]; totalCount: number}> {
        return blogsRepository.findBlogs(queryDto);
    },

    async findBlogByIdOrFail(id: string): Promise<WithId<Blog>> {
        return blogsRepository.findBlogByIdOrFail(id);
    },

    async createBlog(dto: BlogAttributes): Promise<string>{
        const newBlog: Blog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
            // createdAt: dto.createdAt,
            // isMembership: dto.isMembership,
        };

        return blogsRepository.createBlog(newBlog);
    },

    async updateBlogById (id: string, dto: BlogAttributes): Promise<void> {
        await blogsRepository.updateBlogById(id, dto);
        return;
    },

    async deleteBlogById(id: string): Promise<void> {
        await blogsRepository.deleteBlogById(id);
        return;
    },
}