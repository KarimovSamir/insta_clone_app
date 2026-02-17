export class RepositoryForbiddenError extends Error {
    public readonly field?: string;
    public readonly status = 403;

    constructor(message: string = "Forbidden error", field?: string) {
        super(message);
        this.name = "RepositoryForbiddenError";
        this.field = field;
    }
}
