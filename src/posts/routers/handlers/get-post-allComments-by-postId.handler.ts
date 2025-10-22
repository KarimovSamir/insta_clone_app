import { Request, RequestHandler, Response } from 'express';
import { matchedData } from "express-validator";
import { CommentQueryInput } from '../../../comments/routers/input/comment-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { commentsService } from '../../../comments/application/comments.service';
import { mapToCommentListPaginatedOutput } from '../../../comments/routers/mappers/map-to-comment-list-paginated-output.util';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';
import { HttpStatus } from '../../../core/types/http-statuses';

export const getPostAllCommentsByIdHandler: RequestHandler<{ id: string }> = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const postId = req.params.id;

        // Берём только провалидированные query + приводим к нашему типу
        const sanitizedQuery = matchedData(req, {
            locations: ['query'],
            includeOptionals: true,
        }) as CommentQueryInput;

        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const { items, totalCount } = await commentsService.findCommentsByPost(queryInput, postId);

        const commentListOutput = mapToCommentListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(commentListOutput);
    } catch (e) {
        if (e instanceof RepositoryNotFoundError) {
            res.sendStatus(HttpStatus.NotFound);
            return;
        }

        res.sendStatus(HttpStatus.InternalServerError);
    }
};
