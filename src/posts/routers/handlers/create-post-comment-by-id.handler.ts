import { Request, Response } from 'express';
import { CommentCreateByIdInput } from '../../../comments/routers/input/comment-create.input';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';
import { HttpStatus } from '../../../core/types/http-statuses';
import { commentsService } from '../../../comments/application/comments.service';
import { mapToCommentOutputUtil } from '../../../comments/routers/mappers/map-to-comment-output.util';

export async function createPostCommentByIdHandler(
    req: Request<{ id: string }, {}, CommentCreateByIdInput>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const currentUser = res.locals.currentUser!;
        const { content } = req.body;
        const createdCommentId = await commentsService.createCommentWithUrlPostId(
            id, 
            { content },
            currentUser
        );
        const createdComment = await commentsService.findCommentByIdOrFail(createdCommentId);
        const commentOutput = mapToCommentOutputUtil(createdComment);
        res.status(HttpStatus.Created).send(commentOutput);  
    } catch (e: unknown) {
        if (e instanceof RepositoryNotFoundError) {
            res.sendStatus(HttpStatus.NotFound);
            return;
        }
        res.sendStatus(HttpStatus.InternalServerError);
    }
}