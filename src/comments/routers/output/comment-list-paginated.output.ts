import { CommentDataOutput } from "./comment-data.output";

export type CommentListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentDataOutput[];
};
