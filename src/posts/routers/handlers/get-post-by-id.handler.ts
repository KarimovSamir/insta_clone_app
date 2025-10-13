import { Request, Response } from 'express'
import { postsService } from '../../application/posts.service';
import { mapToPostOutputUtil } from '../mappers/map-to-post-output.util';
// import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getPostByIdHandler(
    req: Request<{ id: string}>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const post = await postsService.findPostByIdOrFail(id);
        const postOutput = mapToPostOutputUtil(post);

        // res.send(postOutput);
        res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown) {
        // errorsHandler(e, res);
        res.sendStatus(HttpStatus.NotFound);
    }
}