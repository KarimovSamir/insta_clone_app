import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
// import { blogValidation } from '../../validation/blog.validation';
import { db } from '../../../db/in-memory.db';
import { Blog } from '../../types/blog';
import { blogsRepository } from '../../repositories/blog.repository';
import { BlogInputDto } from '../../dto/blog.input-dto';

export function createBlogHandler(
    // BlogInputDto нужен, чтобы строго ловить именно эти поля. 
    // Если передать ещё какое то лишнее поле, то ошибка
    req: Request<{}, {}, BlogInputDto>, 
    res: Response
){
    // const errors = blogValidation(req.body);
    
    // if (errors.length > 0) {
    //     res.status(HttpStatus.BadRequest).send(CreateErrorMessages(errors));
    //     return;
    // }

    let lastNum = 0;

    for (const { id } of db.blogs) {
        const num = +id;
        if (num > lastNum) {
            lastNum = num
        };
    }
    const nextId = String(lastNum + 1);

    const newBlog: Blog = {
        id: nextId.trim(),
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        websiteUrl: req.body.websiteUrl.trim()
    };

    blogsRepository.createBlog(newBlog);

    res.status(HttpStatus.Created).send(newBlog);
}

