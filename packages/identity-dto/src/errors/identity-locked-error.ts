export class IdentityLockedError extends Error {
  constructor() {
    super('Identity is locked');
  }

  code = 'IDENTITY_LOCKED';
}
