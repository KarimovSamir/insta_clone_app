import { Request, Response } from 'express'
import { UserCreateInput } from '../input/user-create.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { usersService } from '../../application/users.service';
import { mapToUserOutput } from '../mappers/map-to-user-output.util';
import { RepositoryBadRequestError } from '../../../core/errors/repository-bad-request.error';

export async function createUserHandler(
    req: Request<{},{}, UserCreateInput>,
    res: Response
) {
    try {
        const createdUserId = await usersService.createUser(
            req.body,
        );

        const createdUser = await usersService.findUserByIdOrFail(createdUserId);
        const userOutput = mapToUserOutput(createdUser);

        res.status(HttpStatus.Created).send(userOutput);
    } catch (e: unknown) {
        if (e instanceof RepositoryBadRequestError) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [
                {
                    message: e.message,
                    field: e.field ?? ''
                }
                ]
            });
        }
        res.sendStatus(HttpStatus.InternalServerError); 
    }
}