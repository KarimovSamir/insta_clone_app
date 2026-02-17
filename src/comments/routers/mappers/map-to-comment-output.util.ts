import { WithId } from "mongodb";
import { Comment, enumCommentLikeDislikeStatus } from "../../domain/comment";
import { CommentOutput } from "../output/comment.output";


export function mapToCommentOutputUtil (
    comment: WithId<Comment>,
    myStatus: enumCommentLikeDislikeStatus
): CommentOutput{
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: myStatus
        }
    };
}