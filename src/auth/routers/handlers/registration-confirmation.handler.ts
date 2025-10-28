import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RepositoryBadRequestError } from '../../../core/errors/repository-bad-request.error';
import { authService } from '../../application/auth.services';

export async function registrationConfirmationHandler(req: Request<{}, {}, { code: string }>, res: Response) {
    try {
        await authService.confirmByCode(req.body.code);
        return res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        if (e instanceof RepositoryBadRequestError) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ message: e.message, field: e.field ?? '' }],
            });
        }
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}
