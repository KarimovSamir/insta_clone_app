import { ValidationError } from '../../blogs/types/validationError';

export const CreateErrorMessages = (
    errors: ValidationError[],
): { errorsMessages: ValidationError[] } => {
    return { errorsMessages: errors };
};