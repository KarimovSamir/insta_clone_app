import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { postsRepository } from '../../repositories/post.repository';

export async function deletePostHandler(req: Request, res: Response){
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

        await postsRepository.deletePostById(id);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.NotFound);
    }
}

