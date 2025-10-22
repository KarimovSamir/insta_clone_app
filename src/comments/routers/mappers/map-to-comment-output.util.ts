import { WithId } from "mongodb";
import { Comment } from "../../domain/comment";
import { CommentOutput } from "../output/comment.output";


export function mapToCommentOutputUtil (comment: WithId<Comment>): CommentOutput{
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
    };
}