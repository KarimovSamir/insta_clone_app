export class DuplicateFieldError extends Error {
  public readonly field: 'email' | 'login';
  constructor(field: 'email' | 'login', message = 'Already in use') {
    super(message);
    this.name = 'DuplicateFieldError';
    this.field = field;
  }
}
