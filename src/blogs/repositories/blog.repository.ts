import { db } from "../../db/in-memory.db";
import { BlogInputDto } from "../dto/blog.input-dto";
import { Blog } from "../types/blog";

export const blogsRepository = {
    findBlogs(): Blog[] {
        return db.blogs;
    },

    findBlogById(id: string): Blog | null {
        const blogById = db.blogs.find((v) => v.id === id) ?? null;
        return blogById
    },

    createBlog(newBlog: Blog): Blog{
        db.blogs.push(newBlog);
        return newBlog;
    },

    updateBlogById (id: string, dto: BlogInputDto): void {
        const blog = db.blogs.find((v) => v.id === id) ?? null

        if (!blog) {
            throw new Error('Blog not exist');
        }

        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;

        return;
    },

    deleteBlogById(id: string): void{
        const index = db.blogs.findIndex((v) => v.id === id);

        if (index === -1) {
            throw new Error('Blog not exist');
        }

        db.blogs.splice(index, 1);
        return;
    },
}