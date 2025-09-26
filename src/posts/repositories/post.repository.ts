import { Post } from "../types/post";
import { PostInputDto } from "../dto/post.input-dto";
import { postCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";

export const postsRepository = {
    async findPosts(): Promise<WithId<Post>[]> {
        return postCollection.find().toArray();
    },

    async findPostById(id: string): Promise<WithId<Post> | null> {
        return postCollection.findOne({ _id: new ObjectId(id)});
    },

    async createPost(newPost: Post): Promise<WithId<Post>>{
        const insertResult = await postCollection.insertOne(newPost)
        return { ...newPost, _id: insertResult.insertedId };
    },

    async updatePostById (id: string, dto: PostInputDto): Promise<void> {
        const updateResult = await postCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Post not exist');
        }
        return;
    },

    async deletePostById(id: string): Promise<void>{
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Post not exist');
        }
        return;
    },
}