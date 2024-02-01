import { PasswordRule } from './password-rule';

export class PasswordMaxLengthRule extends PasswordRule {
  constructor(readonly maxLength = 64) {
    super();
  }

  validate(password: string): Promise<boolean> {
    return Promise.resolve(password.length < this.maxLength);
  }

  description() {
    return `Password length must be less than ${this.maxLength}`;
  }
}
