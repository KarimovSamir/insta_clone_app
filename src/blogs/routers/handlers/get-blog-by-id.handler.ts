import { Request, Response } from 'express'
import { blogsRepository } from '../../repositories/blog.repository'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';

export function getBlogByIdHandler(req: Request, res: Response){
    const id = req.params.id.trim();
    const blog = blogsRepository.findBlogById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(CreateErrorMessages([{ field: 'id', message: 'Blog not found' }]));
        return;
    }

    res.send(blog);
}