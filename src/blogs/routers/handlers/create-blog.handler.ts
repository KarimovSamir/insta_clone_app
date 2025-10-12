import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { BlogCreateInput } from '../input/blog-create.input';

export async function createBlogHandler(
    // createdAt: new Date().toISOString(),
    req: Request<{}, {}, BlogCreateInput>,
    res: Response
){
    try {
        const createdBlogId = await blogsService.createBlog(
            req.body,
        );

        const createdBlog = await blogsService.findBlogByIdOrFail(createdBlogId);

        const blogOutput = mapToBlogOutput(createdBlog);

        res.status(HttpStatus.Created).send(blogOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

