export class UnknownOperatorError extends Error {
  constructor(operator: string) {
    super(`Unknown operator: ${operator}`);
  }

  code = 'UNKNOWN_OPERATOR';
}
