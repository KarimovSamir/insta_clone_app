import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { blogsRepository } from '../../repositories/blog.repository';

export function deleteBlogHandler(req: Request, res: Response){
    const id = req.params.id.trim();
    const blog = blogsRepository.findBlogById(id);

    if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(CreateErrorMessages([{ field: 'id', message: 'Blog not found' }]));
        return;
    }

    blogsRepository.deleteBlogById(id);
    res.sendStatus(HttpStatus.NoContent);
}

