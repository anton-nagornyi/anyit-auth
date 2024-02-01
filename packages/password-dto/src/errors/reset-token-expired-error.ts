export class ResetTokenExpiredError extends Error {
  constructor() {
    super('Reset token expired');
  }

  code = 'RESET_TOKEN_EXPIRED';
}
