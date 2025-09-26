import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { Blog } from '../../types/blog';
import { blogsRepository } from '../../repositories/blog.repository';
import { BlogInputDto } from '../../dto/blog.input-dto';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model.util';

export async function createBlogHandler(
    // BlogInputDto нужен, чтобы строго ловить именно эти поля. 
    // Если передать ещё какое то лишнее поле, то ошибка
    req: Request<{}, {}, BlogInputDto>, 
    res: Response
){
    try {
        const newBlog: Blog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
    
        const createdBlog = await blogsRepository.createBlog(newBlog);
        const BlogViewModel = mapToBlogViewModel(createdBlog)
        res.status(HttpStatus.Created).send(BlogViewModel);      
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);  
    }
}

