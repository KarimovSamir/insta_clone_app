import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsService } from '../../application/comments.service';
import { CommentUpdateInput } from '../input/comment-update.input';
import { RepositoryForbiddenError } from '../../../core/errors/repository-forbidden.error';

export async function updateCommentByIdHandler(
    req: Request<{ id: string }, {}, CommentUpdateInput>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const currentUser = res.locals.currentUser;

        await commentsService.updateComment(id, req.body, currentUser!);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        if (e instanceof RepositoryForbiddenError) {
            // debugger;
            return res.sendStatus(HttpStatus.Forbidden);
        }
        res.sendStatus(HttpStatus.NotFound);
    }
}