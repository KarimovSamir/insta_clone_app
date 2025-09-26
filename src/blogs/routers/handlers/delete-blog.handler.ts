import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { blogsRepository } from '../../repositories/blog.repository';

export async function deleteBlogHandler(req: Request, res: Response){
    try {
        const id = req.params.id;
        const blog = await blogsRepository.findBlogById(id);

        if (!blog) {
        res
            .status(HttpStatus.NotFound)
            .send(
            CreateErrorMessages([{ field: 'id', message: 'Blog not found' }]),
            );
        return;
        }

        await blogsRepository.deleteBlogById(id);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}

