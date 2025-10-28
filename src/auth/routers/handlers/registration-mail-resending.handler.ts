import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { RepositoryBadRequestError } from '../../../core/errors/repository-bad-request.error';
import { authService } from '../../application/auth.services';
import { RegistrationAttributes } from '../../application/dtos/registration-attributes';
import { authRepository } from '../../repositories/auth.repository';

export async function registrationMailResendingHandler(
    req: Request<{}, {}, { email: string }>,
    res: Response,
) {
    try {
        const userEmail = req.body.email.trim();
        const user = await authRepository.findUserByLoginOrEmail(
            userEmail,
        );

        if (!user) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ message: 'User not found', field: 'email' }],
            });
        }

        if (user.emailConfirmation?.isConfirmed) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ message: 'Email already confirmed', field: 'email' }],
            });
        }

        await authService.resendingMail(userEmail);

        return res.sendStatus(HttpStatus.NoContent); // 204
    } catch (e) {
        if (e instanceof RepositoryBadRequestError) {
            return res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ message: e.message, field: e.field ?? '' }],
            });
        }
        return res.sendStatus(HttpStatus.InternalServerError);
    }
}
