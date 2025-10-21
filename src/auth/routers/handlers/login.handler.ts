import { Request, Response } from 'express';
import { AuthLoginInput } from '../input/auth-login.input';
import { AuthAttributes } from '../../application/dtos/auth-attributes';
import { authService } from '../../application/auth.services';
import { HttpStatus } from '../../../core/types/http-statuses';
import { jwtService } from '../../adapters/jwt.service';
import { authRepository } from '../../repositories/auth.repository';

export async function loginHandler(
    req: Request<{}, {}, AuthLoginInput>,
    res: Response,
) {
    const credentials: AuthAttributes = {
        loginOrEmail: req.body.loginOrEmail,
        password: req.body.password,
    };

    const isValid = await authService.validateCredentials(credentials);

    if (!isValid) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const user = await authRepository.findUserByLoginOrEmail(credentials.loginOrEmail);

    const token = jwtService.createToken(user!._id.toString());

    return res.status(HttpStatus.Ok).json({ accessToken: token });

    // return res.sendStatus(HttpStatus.NoContent);
}