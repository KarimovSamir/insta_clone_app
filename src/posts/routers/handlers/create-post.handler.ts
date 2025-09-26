import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { Post } from '../../types/post';
import { postsRepository } from '../../repositories/post.repository';
import { PostInputDto } from '../../dto/post.input-dto';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';
import { blogsRepository } from '../../../blogs/repositories/blog.repository';

export async function createPostHandler(
    // PostInputDto нужен, чтобы строго ловить именно эти поля. 
    // Если передать ещё какое то лишнее поле, то ошибка
    req: Request<{}, {}, PostInputDto>, 
    res: Response
){
    try {
        const blogNameById = await blogsRepository.findBlogById(req.body.blogId);
        const newBlog: Post = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: blogNameById!.name,
            createdAt: new Date().toISOString(),
        };
    
        const createdPost = await postsRepository.createPost(newBlog);
        const PostViewModel = mapToPostViewModel(createdPost)
        res.status(HttpStatus.Created).send(PostViewModel);      
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.NotFound);  
    }
}

