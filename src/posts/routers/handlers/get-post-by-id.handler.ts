import { Request, Response } from 'express'
import { postsRepository } from '../../repositories/post.repository'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';

export function getPostByIdHandler(req: Request, res: Response){
    const id = req.params.id.trim();
    const post = postsRepository.findPostById(id);

    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(CreateErrorMessages([{ field: 'id', message: 'Post not found' }]));
        return;
    }

    res.send(post);
}