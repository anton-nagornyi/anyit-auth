export class InvalidPasswordHashError extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid password hash');
  }

  code = 'INVALID_PASSWORD_HASH_ERROR';
}
