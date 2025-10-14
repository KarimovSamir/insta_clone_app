import { Request, Response } from 'express'
import { HttpStatus } from '../../../core/types/http-statuses';
import { usersService } from '../../application/users.service';

export async function deleteUserHandler(
    req: Request<{ id: string }>, 
    res: Response
) {
    try {
        const id = req.params.id;

        await usersService.deleteUserById(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        // errorsHandler(e, res);
        res.sendStatus(HttpStatus.NotFound);
    }
}
