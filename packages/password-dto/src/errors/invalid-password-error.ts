export class InvalidPasswordError extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid password');
  }

  code = 'INVALID_PASSWORD_ERROR';
}
