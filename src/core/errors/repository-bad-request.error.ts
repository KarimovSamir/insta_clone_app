export class RepositoryBadRequestError extends Error {
  public readonly field?: string;
  public readonly status = 400;

  constructor(message: string = 'Bad request', field?: string) {
    super(message);
    this.name = 'RepositoryBadRequestError';
    this.field = field;
  }
}
