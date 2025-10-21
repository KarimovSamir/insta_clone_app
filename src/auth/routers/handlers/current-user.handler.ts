import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function currentUserHandler(req: Request, res: Response) {
    return res.status(HttpStatus.Ok).json({
        email: res.locals.currentUser!.email,
        login: res.locals.currentUser!.login,
        userId: res.locals.currentUser!._id.toString(),
    });
}