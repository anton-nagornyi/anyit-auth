import { PasswordNoCommonRule } from '../src/password-rules/password-no-common-rule';
import '@anyit/be-dev';

describe('Given a PasswordNoCommonRule', () => {
  let passwordRule: PasswordNoCommonRule;

  beforeEach(() => {
    passwordRule = new PasswordNoCommonRule();
  });

  describe('When validating a password that is commonly used', () => {
    const commonPasswords = ['123456', 'password', 'qwerty'];

    commonPasswords.forEach((password) => {
      it(`Then it should return false for password "${password}"`, async () => {
        expect(await passwordRule.validate(password)).toBe(false);
      });
    });
  });

  describe('When validating a unique password', () => {
    it('Then it should return true for a unique password', async () => {
      const uniquePassword = 'Unique_Password123!';
      expect(await passwordRule.validate(uniquePassword)).toBe(true);
    });
  });

  describe('When getting the description', () => {
    it('Then it should return the correct description', () => {
      expect(passwordRule.description()).toBe(
        'Commonly used passwords are not allowed',
      );
    });
  });

  describe('When initialized with a custom list of common passwords', () => {
    const customCommonPasswords = ['custom1', 'custom2'];

    beforeEach(() => {
      passwordRule = new PasswordNoCommonRule(customCommonPasswords);
    });

    it('Then it should use the custom list for validation', async () => {
      expect(await passwordRule.validate('custom1')).toBe(false);
      expect(await passwordRule.validate('notInCustomList')).toBe(true);
    });
  });
});
