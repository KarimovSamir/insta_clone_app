import { Request, Response } from 'express'
import { blogsRepository } from '../../repositories/blog.repository'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export async function getBlogByIdHandler(req: Request, res: Response){
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

        const blogViewModel = mapToBlogViewModel(blog);
        res.status(HttpStatus.Ok).send(blogViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.NotFound);
    }
}