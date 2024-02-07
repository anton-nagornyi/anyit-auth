export class WrongArgumentValueError extends Error {
  constructor(name: string) {
    super(`Wrong argument value for ${name}`);
  }

  code = 'WRONG_ARGUMENT_VALUE';
}
