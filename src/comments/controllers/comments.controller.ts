import { inject, injectable } from 'inversify';
import { RequestHandler } from 'express';
import { TYPES } from '../../core/ioc/types';
import { HttpStatus } from '../../core/types/http-statuses';
import { RepositoryForbiddenError } from '../../core/errors/repository-forbidden.error';
import { CommentsService } from '../application/comments.service';
import { mapToCommentOutputUtil } from '../routers/mappers/map-to-comment-output.util';
import { CommentUpdateInput } from '../routers/input/comment-update.input';

type CommentRequestParams = { id: string };

type CurrentUser = { _id: any; login: string; email: string; createdAt: string };

@injectable()
export class CommentsController {
  constructor(
    @inject(TYPES.CommentsService)
    private readonly commentsService: CommentsService,
  ) {}

  getCommentById: RequestHandler<CommentRequestParams> = async (req, res) => {
    try {
      const comment = await this.commentsService.findCommentByIdOrFail(
        req.params.id,
      );
      const commentOutput = mapToCommentOutputUtil(comment);

      res.status(HttpStatus.Ok).send(commentOutput);
    } catch (error) {
      res.sendStatus(HttpStatus.NotFound);
    }
  };

  updateCommentById: RequestHandler<CommentRequestParams, unknown, CommentUpdateInput> = async (
    req,
    res,
  ) => {
    try {
      const currentUser = res.locals.currentUser as CurrentUser | undefined;

      await this.commentsService.updateComment(req.params.id, req.body, currentUser!);

      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      if (error instanceof RepositoryForbiddenError) {
        res.sendStatus(HttpStatus.Forbidden);
        return;
      }

      res.sendStatus(HttpStatus.NotFound);
    }
  };

  deleteCommentById: RequestHandler<CommentRequestParams> = async (req, res) => {
    try {
      const currentUser = res.locals.currentUser as CurrentUser | undefined;

      await this.commentsService.deleteComment(req.params.id, currentUser!);

      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      if (error instanceof RepositoryForbiddenError) {
        res.sendStatus(HttpStatus.Forbidden);
        return;
      }

      res.sendStatus(HttpStatus.NotFound);
    }
  };
}
