import { PasswordRule } from './password-rule';

export class PasswordMinLengthRule extends PasswordRule {
  constructor(readonly minLength = 8) {
    super();
  }

  validate(password: string): Promise<boolean> {
    return Promise.resolve(password.length >= this.minLength);
  }

  description() {
    return `Password length must be greater than ${this.minLength}`;
  }
}
