import { Request, RequestHandler, Response } from 'express'
import { matchedData } from 'express-validator';
import { PostQueryInput } from '../input/post-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { postsService } from '../../application/posts.service';
import { mapToPostListPaginatedOutput } from '../mappers/map-to-post-list-paginated-output.util';
// import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';

export const getPostListHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const sanitizedQuery = matchedData<PostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsService.findPosts(queryInput);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(postListOutput);
  } catch (e: unknown) {
    // errorsHandler(e, res);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};