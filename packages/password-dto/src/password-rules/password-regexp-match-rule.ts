import { PasswordRule } from './password-rule';

export class PasswordRegexpMatchRule extends PasswordRule {
  constructor(
    readonly regExp: string | RegExp,
    readonly customDescription = null,
  ) {
    super();
  }

  validate(password: string): Promise<boolean> {
    return Promise.resolve(Boolean(password.match(this.regExp)));
  }

  description(): string {
    return (
      this.customDescription ??
      `Password must match the expression ${this.regExp.toString()}`
    );
  }
}
