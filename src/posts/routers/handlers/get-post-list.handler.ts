import { Request, Response } from 'express'
import { postsRepository } from '../../repositories/post.repository'

export function getPostListHandler(req: Request, res: Response){
    const getAllPosts = postsRepository.findPosts()
    res.send(getAllPosts)
}