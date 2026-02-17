export enum enumPostLikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export type PostLikeStatus = {
    postId: string;
    userId: string;
    userLogin: string; // Храним логин здесь, чтобы не обращаться в юзеру, ради скорости
    status: enumPostLikeStatus;
    addedAt: string;
};

export type NewestLikes = {
    addedAt: string;
    userId: string;
    login: string;
};

export type ExtendedLikesInfo = {
    likesCount: number;
    dislikesCount: number;
    myStatus: enumPostLikeStatus;
    newestLikes: NewestLikes[];
};