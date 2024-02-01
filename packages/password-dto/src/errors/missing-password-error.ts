export class MissingPasswordError extends Error {
  constructor() {
    super('Missing password');
  }

  code = 'MISSING_PASSWORD_ERROR';
}
