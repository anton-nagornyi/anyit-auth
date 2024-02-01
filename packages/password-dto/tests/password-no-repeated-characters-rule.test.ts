import { PasswordNoRepeatedCharactersRule } from '../src/password-rules/password-no-repeated-characters-rule';
import '@anyit/be-dev';

describe('Given a PasswordNoRepeatedCharactersRule', () => {
  let passwordRule: PasswordNoRepeatedCharactersRule;

  describe('When the rule allows up to 2 repeated characters', () => {
    beforeEach(() => {
      passwordRule = new PasswordNoRepeatedCharactersRule(2);
    });

    it('Then it should return true for passwords without repeated characters', async () => {
      const validPassword = 'abcde';
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return true for passwords with exactly 2 repeated characters', async () => {
      const validPassword = 'abcc';
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return false for passwords with more than 2 repeated characters', async () => {
      const invalidPassword = 'abccc';
      expect(await passwordRule.validate(invalidPassword)).toBe(false);
    });

    it('Then it should return the correct description', () => {
      expect(passwordRule.description()).toBe(
        'Maximum allowed character repeats is 2',
      );
    });
  });

  describe('When initialized with a custom number of allowed repeats', () => {
    const allowedRepeats = 3;

    beforeEach(() => {
      passwordRule = new PasswordNoRepeatedCharactersRule(allowedRepeats);
    });

    it('Then it should allow passwords with up to 3 repeated characters', async () => {
      const validPassword = 'aaabbbccc';
      expect(await passwordRule.validate(validPassword)).toBe(true);
    });

    it('Then it should return the correct custom description', () => {
      expect(passwordRule.description()).toBe(
        `Maximum allowed character repeats is ${allowedRepeats}`,
      );
    });
  });
});
