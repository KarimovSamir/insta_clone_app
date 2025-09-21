import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { postsRepository } from '../../repositories/post.repository';

export function deletePostHandler(req: Request, res: Response){
    const id = req.params.id.trim();
    const post = postsRepository.findPostById(id);

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(CreateErrorMessages([{ field: 'id', message: 'Post not found' }]));
        return;
    }

    postsRepository.deletePostById(id);
    res.sendStatus(HttpStatus.NoContent);
}

