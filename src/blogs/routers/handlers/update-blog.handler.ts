import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { BlogUpdateInput } from '../input/blog-update.input';

export async function updateBlogByIdHandler(
    req: Request<{ id: string }, {}, BlogUpdateInput>,
    res: Response,
){
  try {
    const id = req.params.id;

    await blogsService.updateBlogById(id, req.body.data.attributes);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}