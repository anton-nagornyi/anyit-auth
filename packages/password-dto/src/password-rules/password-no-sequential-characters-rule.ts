import { PasswordRule } from './password-rule';

export class PasswordNoSequentialCharactersRule extends PasswordRule {
  validate(password: string): Promise<boolean> {
    for (let i = 0; i < password.length - 2; i++) {
      const charCode1 = password.charCodeAt(i);
      const charCode2 = password.charCodeAt(i + 1);
      const charCode3 = password.charCodeAt(i + 2);

      if (
        (charCode2 === charCode1 + 1 && charCode3 === charCode2 + 1) ||
        (charCode2 === charCode1 - 1 && charCode3 === charCode2 - 1)
      ) {
        return Promise.resolve(false);
      }
    }
    return Promise.resolve(true);
  }

  description(): string {
    return 'No sequential characters allowed';
  }
}
