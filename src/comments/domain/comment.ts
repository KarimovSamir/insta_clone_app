export type Comment = {
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    likesInfo: CommentLikeDislikeCount;
};

export type CommentLikeDislikeCount = {
    likesCount: number;
    dislikesCount: number;
};

export type CommentLikeDislikeStatus = {
    userId: string;
    commentId: string;
    status: enumCommentLikeDislikeStatus;
    createdAt: string;
};

export enum enumCommentLikeDislikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike",
}
