import { Blog } from "../types/blog";
import { BlogInputDto } from "../dto/blog.input-dto";
import { blogCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const blogsRepository = {
    async findBlogs(): Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },

    async findBlogById(id: string): Promise<WithId<Blog> | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) })
    },

    async createBlog(newBlog: Blog): Promise<WithId<Blog>>{
        const insertResult = await blogCollection.insertOne(newBlog);
        return { ...newBlog, _id: insertResult.insertedId };
    },

    async updateBlogById (id: string, dto: BlogInputDto): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Blog not exist');
        }
        return;
    },

    async deleteBlogById(id: string): Promise<void>{
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Blog not exist');
        }
        return;
    },
}