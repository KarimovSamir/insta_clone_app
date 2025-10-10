import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../../posts/application/posts.service';
import { PostCreateInput } from '../../../posts/routers/input/post-create.input';
import { mapToPostOutputUtil } from '../../../posts/routers/mappers/map-to-post-output.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function createBlogPostByIdHandler(
    req: Request<{ id: string }, {}, PostCreateInput>,
    res: Response,
) {
    try {  
        const id = req.params.id;
        const createdPostId = await postsService.createPostWithUrlBlogId(id, req.body.data.attributes);
        const createdPost = await postsService.findPostByIdOrFail(createdPostId);
        const postOutput = mapToPostOutputUtil(createdPost);
        res.status(HttpStatus.Created).send(postOutput);   
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
