import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostUpdateInput } from '../input/post-update.input';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updatePostByIdHandler(
    req: Request<{ id: string }, {}, PostUpdateInput>,
    res: Response,
){
    try {
        const id = req.params.id;

        await postsService.updatePostById(id, req.body.data.attributes);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}