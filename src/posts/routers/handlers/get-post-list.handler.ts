import { Request, Response } from 'express'
import { postsRepository } from '../../repositories/post.repository'
import { mapToPostViewModel } from '../mappers/map-to-post-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getPostListHandler(req: Request, res: Response){
    try {
        const posts = await postsRepository.findPosts();
        const postViewModels = posts.map(mapToPostViewModel);
        res.send(postViewModels);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}