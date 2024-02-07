export class MissingIdentityError extends Error {
  constructor() {
    super('Missing identity');
  }

  code = 'MISSING_IDENTITY';
}
