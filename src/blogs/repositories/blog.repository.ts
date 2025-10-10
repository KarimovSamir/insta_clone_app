import { Blog } from "../domain/blog";
import { blogCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { BlogAttributes } from "../application/dtos/blog-attributes";

export const blogsRepository = {
    async findBlogs(
        queryDto: BlogQueryInput,
    ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        const items = await blogCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray();

        const totalCount = await blogCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findBlogByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError('Driver not exist');
        }
        return res;
    },

    async createBlog(newBlog: Blog): Promise<string>{
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();
    },
    
    async updateBlogById (id: string, dto: BlogAttributes): Promise<void> {
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
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return;
    },
}