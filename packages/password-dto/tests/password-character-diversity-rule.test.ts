import { PasswordCharacterDiversityRule } from '../src/password-rules/password-character-diversity-rule';
import '@anyit/be-dev';

describe('Given a PasswordCharacterDiversityRule', () => {
  let passwordRule: PasswordCharacterDiversityRule;

  beforeEach(() => {
    passwordRule = new PasswordCharacterDiversityRule();
  });

  describe('When validating a password', () => {
    describe('And the password meets all criteria', () => {
      it('Then it should return true', async () => {
        const validPasswords = ['aA1!', 'Password123!', 'n3wP@ssw0rd'];

        for (const password of validPasswords) {
          const result = await passwordRule.validate(password);
          expect(result).toBe(true);
        }
      });
    });

    describe('And the password does not meet all criteria', () => {
      it('Then it should return false', async () => {
        const invalidPasswords = [
          'password',
          'PASSWORD',
          '123456',
          '123456a',
          '123456A',
          'aA1',
          'password!',
          'passwoRD!',
        ];

        for (const password of invalidPasswords) {
          const result = await passwordRule.validate(password);
          expect(result).toBe(false);
        }
      });
    });
  });

  describe('When getting the description', () => {
    it('Then it should return the correct description', () => {
      const description = passwordRule.description();
      expect(description).toBe(
        'Password must include at least one uppercase letter, one lowercase letter, one number and one special character',
      );
    });
  });
});
