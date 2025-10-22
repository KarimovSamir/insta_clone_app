import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsService } from '../../application/comments.service';
import { CommentUpdateInput } from '../input/comment-update.input';

export async function updateCommentByIdHandler(
    req: Request<{ id: string }, {}, CommentUpdateInput>,
    res: Response,
){
  try {
    const id = req.params.id;

    await commentsService.updateComment(id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    // errorsHandler(e, res);
    res.sendStatus(HttpStatus.NotFound);
  }
}