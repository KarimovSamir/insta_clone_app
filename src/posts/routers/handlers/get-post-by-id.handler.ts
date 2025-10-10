import { Request, Response } from 'express'
import { postsService } from '../../application/posts.service';
import { mapToPostOutputUtil } from '../mappers/map-to-post-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getPostByIdHandler(
    req: Request<{ id: string}>,
    res: Response,
) {
    try {
        const id = req.params.id;
        const post = await postsService.findPostByIdOrFail(id);
        const postOutput = mapToPostOutputUtil(post);

        res.send(postOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}