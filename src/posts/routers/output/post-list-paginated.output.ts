import { PaginatedOutput } from "../../../core/types/paginated.output";
import { PostDataOutput } from "./post-data.output";

export type PostListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostDataOutput[];
};
