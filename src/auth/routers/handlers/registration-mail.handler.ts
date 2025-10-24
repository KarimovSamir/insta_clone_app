import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RepositoryBadRequestError } from '../../../core/errors/repository-bad-request.error';
import { authService } from '../../application/auth.services';
import { RegistrationAttributes } from '../../application/dtos/registration-attributes';

export async function registrationMailHandler(
    req: Request<{}, {}, RegistrationAttributes>,
    res: Response,
) {
    try {
        await authService.registerMail(req.body);
        return res.sendStatus(HttpStatus.NoContent); // 204
    } catch (e) {
        if (e instanceof RepositoryBadRequestError) {
            // Ровно тот формат, который у тебя принят в проекте
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ message: e.message, field: e.field ?? '' }],
            });
        }
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}
