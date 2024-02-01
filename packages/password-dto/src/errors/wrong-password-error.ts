export class WrongPasswordError extends Error {
  constructor() {
    super('Wrong otp');
  }

  code = 'WRONG_PASSWORD';
}
