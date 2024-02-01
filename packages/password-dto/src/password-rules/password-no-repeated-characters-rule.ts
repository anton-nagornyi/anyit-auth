import { PasswordRule } from './password-rule';

export class PasswordNoRepeatedCharactersRule extends PasswordRule {
  constructor(readonly allowedRepeats = 2) {
    super();
  }

  validate(password: string): Promise<boolean> {
    for (let i = 0; i < password.length - this.allowedRepeats; ++i) {
      let series = 1;
      for (let j = i + 1; j < i + 1 + this.allowedRepeats; ++j) {
        if (password[i] === password[j]) {
          ++series;
        } else {
          break;
        }
      }
      if (series > this.allowedRepeats) {
        return Promise.resolve(false);
      }
    }
    return Promise.resolve(true);
  }

  description(): string {
    return `Maximum allowed character repeats is ${this.allowedRepeats}`;
  }
}
