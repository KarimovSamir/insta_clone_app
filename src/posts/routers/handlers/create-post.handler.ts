import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';
import { PostCreateInput } from '../input/post-create.input';
import { mapToPostOutputUtil } from '../mappers/map-to-post-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createPostHandler(
    // PostCreateInput нужен, чтобы строго ловить именно эти поля. 
    // Если передать ещё какое то лишнее поле, то ошибка
    req: Request<{}, {}, PostCreateInput>, 
    res: Response
){
    try {
        const createdPostId = await postsService.createPost(req.body.data.attributes);
        const createdPost = await postsService.findPostByIdOrFail(createdPostId);
        const postOutput = mapToPostOutputUtil(createdPost);
        res.status(HttpStatus.Created).send(postOutput);     
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

