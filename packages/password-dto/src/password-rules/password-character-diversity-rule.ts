import { PasswordRule } from './password-rule';
import { PasswordRegexpMatchRule } from './password-regexp-match-rule';

export class PasswordCharacterDiversityRule extends PasswordRule {
  private readonly regexpMatch = new PasswordRegexpMatchRule(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?\\|`~-]).*$/,
  );

  validate(password: string): Promise<boolean> {
    return this.regexpMatch.validate(password);
  }

  description() {
    return 'Password must include at least one uppercase letter, one lowercase letter, one number and one special character';
  }
}
