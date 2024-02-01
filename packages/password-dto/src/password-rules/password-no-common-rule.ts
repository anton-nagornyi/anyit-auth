import { PasswordRule } from './password-rule';

const defaultCommonPasswords = [
  '123456',
  'password',
  '123456789',
  '12345',
  '12345678',
  'qwerty',
  '1234567',
  '111111',
  '1234567890',
  '123123',
  'abc123',
  '1234',
  'password1',
  'iloveyou',
  '1q2w3e4r',
  '000000',
  'qwerty123',
  'zaq12wsx',
  'dragon',
  'sunshine',
  'princess',
  'letmein',
  '654321',
  'monkey',
  '27653',
  '1qaz2wsx',
  '123321',
  'qwertyuiop',
  'superman',
  'asdfghjkl',
];

export class PasswordNoCommonRule extends PasswordRule {
  constructor(commonPasswords = defaultCommonPasswords) {
    super();

    this.forbiddenPasswords = new Set(commonPasswords);
  }

  private readonly forbiddenPasswords: Set<string>;

  validate(password: string): Promise<boolean> {
    return Promise.resolve(!this.forbiddenPasswords.has(password));
  }

  description() {
    return 'Commonly used passwords are not allowed';
  }
}
