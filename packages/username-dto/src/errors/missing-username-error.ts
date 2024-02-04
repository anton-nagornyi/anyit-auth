export class MissingUsernameError extends Error {
  constructor() {
    super('Missing username');
  }

  code = 'MISSING_USERNAME';
}
