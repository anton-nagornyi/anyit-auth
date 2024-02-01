import { PasswordNoSequentialCharactersRule } from '../src/password-rules/password-no-sequential-characters-rule';
import '@anyit/be-dev';

describe('Given a PasswordNoSequentialCharactersRule', () => {
  const passwordRule = new PasswordNoSequentialCharactersRule();

  describe('When validating a password', () => {
    describe('And the password does not contain sequential characters', () => {
      it('Then it should return true', async () => {
        const nonSequentialPasswords = ['password', 'ab0cd1ef', 'random'];

        for (const password of nonSequentialPasswords) {
          const result = await passwordRule.validate(password);
          expect(result).toBe(true);
        }
      });
    });

    describe('And the password contains ascending sequential characters', () => {
      it('Then it should return false', async () => {
        const sequentialPassword = 'abc';
        expect(await passwordRule.validate(sequentialPassword)).toBe(false);
      });
    });

    describe('And the password contains descending sequential characters', () => {
      it('Then it should return false', async () => {
        const sequentialPassword = 'cba';
        expect(await passwordRule.validate(sequentialPassword)).toBe(false);
      });
    });
  });

  describe('When getting the description', () => {
    it('Then it should return the correct description', () => {
      expect(passwordRule.description()).toBe(
        'No sequential characters allowed',
      );
    });
  });
});
