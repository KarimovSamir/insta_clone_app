import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsService } from '../../application/comments.service';
import { mapToCommentOutputUtil } from '../mappers/map-to-comment-output.util';

export async function getCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const comment = await commentsService.findCommentByIdOrFail(id);
    const commentOutput = mapToCommentOutputUtil(comment);

    res.status(HttpStatus.Ok).send(commentOutput);
  } catch (e: unknown) {
    // errorsHandler(e, res);
    res.sendStatus(HttpStatus.NotFound);
  }
}
