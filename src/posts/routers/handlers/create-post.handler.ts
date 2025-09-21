import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { CreateErrorMessages } from '../../../core/utils/error.utils';
// import { postValidation } from '../../validation/post.validation';
import { db } from '../../../db/in-memory.db';
import { Post } from '../../types/post';
import { postsRepository } from '../../repositories/post.repository';
import { PostInputDto } from '../../dto/post.input-dto';

export function createPostHandler(
    // PostInputDto нужен, чтобы строго ловить именно эти поля. 
    // Если передать ещё какое то лишнее поле, то ошибка
    req: Request<{}, {}, PostInputDto>, 
    res: Response
){
    let lastNum = 0;

    for (const { id } of db.posts) {
        const num = +id;
        if (num > lastNum) {
            lastNum = num
        };
    }
    const nextId = String(lastNum + 1);

    const newPost: Post = {
        id: nextId.trim(),
        title: req.body.title.trim(),
        shortDescription: req.body.shortDescription.trim(),
        content: req.body.content.trim(),
        blogId: req.body.blogId.trim(),
        blogName: req.body.blogName.trim()
    };

    postsRepository.createPost(newPost);

    res.status(HttpStatus.Created).send(newPost);
}

