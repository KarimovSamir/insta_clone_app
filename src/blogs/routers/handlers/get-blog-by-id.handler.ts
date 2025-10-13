import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
// import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const blog = await blogsService.findBlogByIdOrFail(id);
    const blogOutput = mapToBlogOutput(blog);

    res.status(HttpStatus.Ok).send(blogOutput);
  } catch (e: unknown) {
    // errorsHandler(e, res);
    res.sendStatus(HttpStatus.NotFound);
  }
}
