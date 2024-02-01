export class WrongResetTokenError extends Error {
  constructor() {
    super('Wrong reset token');
  }

  code = 'WRONG_RESET_TOKEN';
}
