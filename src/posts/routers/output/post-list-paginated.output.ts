import { PaginatedOutput } from '../../../core/types/paginated.output';
import { PostDataOutput } from './post-data.output';

export type PostListPaginatedOutput = {
  meta: PaginatedOutput;
  data: PostDataOutput[];
};
