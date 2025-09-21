import { Request, Response } from 'express'
import { blogsRepository } from '../../repositories/blog.repository'

export function getBlogListHandler(req: Request, res: Response){
    const getAllBlogs = blogsRepository.findBlogs()
    res.send(getAllBlogs)
}