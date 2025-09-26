import { Request, Response } from 'express'
import { postsRepository } from '../../repositories/post.repository'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';

export async function getPostByIdHandler(req: Request, res: Response){
    try {
        const id = req.params.id;
        const post = await postsRepository.findPostById(id);

        if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(
                CreateErrorMessages([{ field: 'id', message: 'Post not found' }]),
            );

        return;
        }

        const postViewModel = mapToPostViewModel(post);
        res.status(HttpStatus.Ok).send(postViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}