import { BlogDataOutput } from './blog-data.output';
import { PaginatedOutput } from '../../../core/types/paginated.output';

export type BlogListPaginatedOutput = {
  meta: PaginatedOutput;
  data: BlogDataOutput[];
};
