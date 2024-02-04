export class WrongUsernameError extends Error {
  constructor() {
    super('Wrong username');
  }

  code = 'WRONG_USERNAME';
}
