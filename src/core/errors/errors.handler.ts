import { ValidationErrorType } from "../types/validationError";

export const CreateErrorMessages = (
    errors: ValidationErrorType[],
): { errorsMessages: ValidationErrorType[] } => {
    return { errorsMessages: errors };
};
