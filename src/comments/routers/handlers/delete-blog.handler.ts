import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsService } from '../../application/comments.service';

export async function deleteCommentHandler(
    req: Request<{ id: string }>, 
    res: Response
) {
    try {
        const id = req.params.id;

        await commentsService.deleteComment(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        // errorsHandler(e, res);
        res.sendStatus(HttpStatus.NotFound);
    }
}

