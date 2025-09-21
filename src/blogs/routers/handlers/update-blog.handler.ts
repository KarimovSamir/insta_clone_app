import { Request, Response } from 'express'
import { blogsRepository } from '../../repositories/blog.repository'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { BlogInputDto } from '../../dto/blog.input-dto';
// import { blogValidation } from '../../validation/blog.validation';

export function updateBlogByIdHandler(
    req: Request<{ id: string }, {}, BlogInputDto>,
    res: Response,
){
    const id = req.params.id.trim();
    // const errors = blogValidation(req.body);

    // if (errors.length > 0) {
    //     res.status(HttpStatus.BadRequest).send(CreateErrorMessages(errors));
    //     return;
    // }

    const blog = blogsRepository.findBlogById(id);
    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(CreateErrorMessages([{ field: 'id', message: 'Blog not found' }]));
        return;
    }

    blogsRepository.updateBlogById(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
}