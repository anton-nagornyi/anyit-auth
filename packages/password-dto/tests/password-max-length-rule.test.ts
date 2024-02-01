import { PasswordMaxLengthRule } from '../src/password-rules/password-max-length-rule';
import '@anyit/be-dev';

describe('Given a PasswordMaxLengthRule', () => {
  describe('When validating a password with a default maximum length', () => {
    const passwordRule = new PasswordMaxLengthRule();

    it('Then it should return true for passwords shorter than the default maximum length', async () => {
      const validPassword = 'A'.repeat(63);
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return false for passwords equal to or longer than the default maximum length', async () => {
      const invalidPassword = 'A'.repeat(64);
      expect(await passwordRule.validate(invalidPassword)).toBe(false);
    });

    it('Then it should return the correct default description', () => {
      expect(passwordRule.description()).toBe(
        'Password length must be less than 64',
      );
    });
  });

  describe('When validating a password with a custom maximum length', () => {
    const maxLength = 10;
    const passwordRule = new PasswordMaxLengthRule(maxLength);

    it('Then it should return true for passwords shorter than the custom maximum length', async () => {
      const validPassword = 'A'.repeat(maxLength - 1);
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return false for passwords equal to or longer than the custom maximum length', async () => {
      const invalidPassword = 'A'.repeat(maxLength);
      expect(await passwordRule.validate(invalidPassword)).toBe(false);
    });

    it('Then it should return the correct custom description', () => {
      expect(passwordRule.description()).toBe(
        `Password length must be less than ${maxLength}`,
      );
    });
  });
});
