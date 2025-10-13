import { Request, RequestHandler, Response } from 'express'
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogListPaginatedOutput } from '../mappers/map-to-blog-list-paginated-output.util';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../../core/types/http-statuses';
// import { errorsHandler } from '../../../core/errors/errors.handler';

// export async function getBlogListHandler(
//     req: Request<{}, {}, {}, BlogQueryInput>,
//     res: Response,
// ) {
//     try {
//         const sanitizedQuery = matchedData<BlogQueryInput>(req, {
//             locations: ['query'],
//             includeOptionals: true,
//         }); //утилита для извечения трансформированных значений после валидатара
//         //в req.query остаются сырые квери параметры (строки)
//         const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
//         const testAnswer = await blogsService.findBlogs(queryInput);

//         const { items, totalCount } = await blogsService.findBlogs(queryInput);

//         const blogsListOutput = mapToBlogListPaginatedOutput(items, {
//             pageNumber: queryInput.pageNumber,
//             pageSize: queryInput.pageSize,
//             totalCount,
//         });

//         res.send(blogsListOutput);

//         // res.send(queryInput);
//     } catch (e: unknown) {
//         // errorsHandler(e, res);
//         res.sendStatus(HttpStatus.InternalServerError);
//     }
// }

export const getBlogListHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    // после валидации приводим тип к нашему инпуту
    const sanitizedQuery = matchedData(req, {
      locations: ['query'],
      includeOptionals: true,
    }) as BlogQueryInput;
    //утилита для извечения трансформированных значений после валидатара
    //в req.query остаются сырые квери параметры (строки)

    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    // ты вызывал findBlogs дважды — оставим один вызов
    const { items, totalCount } = await blogsService.findBlogs(queryInput);

    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(blogsListOutput);
  } catch (e) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};