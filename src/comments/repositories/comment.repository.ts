import { injectable } from "inversify";
import { ObjectId, WithId } from "mongodb";
import { commentCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentAttributes } from "../application/dtos/comment-attributes";
import { Comment } from "../domain/comment";
import { CommentQueryInput } from "../routers/input/comment-query.input";

@injectable()
export class CommentRepository {
    async findCommentsByPost(
        queryDto: CommentQueryInput,
        postId: string,
    ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
        // Фильтрация по документации работала по другому. Теперь фильтр совпадает с текущей документацией
        // const filter = { 'comment.id': postId };
        const filter = { postId };
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            commentCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            commentCollection.countDocuments(filter),
        ]);
        return { items, totalCount };
    }

    async findCommentByIdOrFail(id: string): Promise<WithId<Comment>> {
        const res = await commentCollection.findOne({ _id: new ObjectId(id) });

        if (!res) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
        return res;
    }

    async createComment(newComment: Comment): Promise<string> {
        const insertResult = await commentCollection.insertOne(newComment);
        return insertResult.insertedId.toString();
    }

    async updateCommentById(id: string, dto: CommentAttributes): Promise<void> {
        const updateResult = await commentCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    content: dto.content,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error("Comment not exist");
        }
    }

    async deleteCommentById(id: string): Promise<void> {
        const deleteResult = await commentCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("Comment not exist");
        }
    }

    async updateCommentLikesInfo(
        commentId: string,
        likesCount: number,
        dislikesCount: number,
    ): Promise<void> {
        await commentCollection.updateOne(
            { _id: new ObjectId(commentId) },
            {
                $set: {
                    "likesInfo.likesCount": likesCount,
                    "likesInfo.dislikesCount": dislikesCount,
                },
            },
        );
    }
}
