import { Request, RequestHandler, Response } from 'express';
// import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { PostQueryInput } from '../../../posts/routers/input/post-query.input';
import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-to-post-list-paginated-output.util';
import { HttpStatus } from '../../../core/types/http-statuses';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';

// export async function getBlogPostListHandler(
//     req: Request<{ id: string }, {}, {}, PostQueryInput>,
//     res: Response,
// ) {
//     try {
//         const blogId = req.params.id;
//         const queryInput = req.query;

//         const { items, totalCount } = await postsService.findPostsByBlog(
//             queryInput,
//             blogId,
//         );

//         const postListOutput = mapToPostListPaginatedOutput(items, {
//             pageNumber: queryInput.pageNumber,
//             pageSize: queryInput.pageSize,
//             totalCount,
//         });
//         res.send(postListOutput);
//     } catch (e: unknown) {
//         // errorsHandler(e, res);
//         res.sendStatus(HttpStatus.InternalServerError);
//     }
// }

export const getBlogPostListHandler: RequestHandler<{ id: string }> = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const blogId = req.params.id;

    // Берём только провалидированные query + приводим к нашему типу
    const sanitizedQuery = matchedData(req, {
      locations: ['query'],
      includeOptionals: true,
    }) as PostQueryInput;

    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsService.findPostsByBlog(queryInput, blogId);

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(postListOutput);
  } catch (e) {
    if (e instanceof RepositoryNotFoundError) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
