import { PasswordMinLengthRule } from '../src/password-rules/password-min-length-rule';
import '@anyit/be-dev';

describe('Given a PasswordMinLengthRule', () => {
  describe('When validating a password with a default minimum length', () => {
    const passwordRule = new PasswordMinLengthRule();

    it('Then it should return true for passwords equal to or longer than the default minimum length', async () => {
      const validPassword = 'A'.repeat(8);
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return false for passwords shorter than the default minimum length', async () => {
      const invalidPassword = 'A'.repeat(7);
      expect(await passwordRule.validate(invalidPassword)).toBe(false);
    });

    it('Then it should return the correct default description', () => {
      expect(passwordRule.description()).toBe(
        'Password length must be greater than 8',
      );
    });
  });

  describe('When validating a password with a custom minimum length', () => {
    const minLength = 10;
    const passwordRule = new PasswordMinLengthRule(minLength);

    it('Then it should return true for passwords equal to or longer than the custom minimum length', async () => {
      const validPassword = 'A'.repeat(10);
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return false for passwords shorter than the custom minimum length', async () => {
      const invalidPassword = 'A'.repeat(9);
      expect(await passwordRule.validate(invalidPassword)).toBe(false);
    });

    it('Then it should return the correct custom description', () => {
      expect(passwordRule.description()).toBe(
        `Password length must be greater than ${minLength}`,
      );
    });
  });
});
