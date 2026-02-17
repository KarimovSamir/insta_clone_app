// import { BlogDataOutput } from './blog-data.output';
// import { PaginatedOutput } from '../../../core/types/paginated.output';

// export type BlogListPaginatedOutput = {
//   meta: PaginatedOutput;
//   data: BlogDataOutput[];
// };

import { BlogDataOutput } from "./blog-data.output";
import { PaginatedOutput } from "../../../core/types/paginated.output";

export type BlogListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: BlogDataOutput[];
};
