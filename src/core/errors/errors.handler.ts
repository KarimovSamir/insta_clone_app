// import { ValidationErrorType } from "../types/validationError";

// export const CreateErrorMessages = (
//     errors: ValidationErrorType[],
// ): { errorsMessages: ValidationErrorType[] } => {
//     return { errorsMessages: errors };
// };

import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../types/http-statuses';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { DuplicateFieldError } from './duplicate-field.error';

// единый обработчик
export function errorsHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // 404
  if (err instanceof RepositoryNotFoundError) {
    return res.sendStatus(HttpStatus.NotFound);
  }

  // 400
  if (err instanceof DuplicateFieldError) {
    return res.status(HttpStatus.BadRequest).send({
      errorsMessages: [{ field: err.field, message: err.message }],
    });
  }

  // по умолчанию — 500
  return res.sendStatus(HttpStatus.InternalServerError);
}
