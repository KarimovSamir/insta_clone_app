import { injectable } from "inversify";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { PostAttributes } from "../application/dtos/post-attributes";
import { Post } from "../domain/post";
import { PostQueryInput } from "../routers/input/post-query.input";

@injectable()
export class PostRepository {
    async findPosts(
        queryDto: PostQueryInput,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
        const filter: Record<string, unknown> = {};
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return { items, totalCount };
    }

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
        const filter = { blogId };
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return { items, totalCount };
    }

    async findPostByIdOrFail(id: string): Promise<WithId<Post>> {
        const res = await postCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Post not exist");
        }
        return res;
    }

    async createPost(newPost: Post): Promise<string> {
        const insertResult = await postCollection.insertOne(newPost);
        return insertResult.insertedId.toString();
    }

    async updatePostById(id: string, dto: PostAttributes): Promise<void> {
        const updateResult = await postCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error("Post not exist");
        }
    }

    async deletePostById(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Post not exist");
        }
    }
}
