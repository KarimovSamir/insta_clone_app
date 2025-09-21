import { Request, Response } from 'express'
import { postsRepository } from '../../repositories/post.repository'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { PostInputDto } from '../../dto/post.input-dto';
// import { postValidation } from '../../validation/post.validation';

export function updatePostByIdHandler(
    req: Request<{ id: string }, {}, PostInputDto>,
    res: Response,
){
    const id = req.params.id.trim();

    const post = postsRepository.findPostById(id);
    if (!post) {
        res
            .status(HttpStatus.NotFound)
            .send(CreateErrorMessages([{ field: 'id', message: 'Post not found' }]));
        return;
    }

    postsRepository.updatePostById(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
}