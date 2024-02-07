export class IdentityInactiveError extends Error {
  constructor() {
    super('Identity is inactive');
  }

  code = 'IDENTITY_INACTIVE';
}
