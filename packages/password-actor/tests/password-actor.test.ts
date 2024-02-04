import '@anyit/be-dev';
import {
  VerifyUserCreation,
  DeleteUser,
  SignInUser,
  CreateUser,
} from '@anyit/auth-actor-dto';
import {
  InvalidPasswordError,
  PasswordMinLengthRule,
  WrongPasswordError,
  MissingPasswordError,
  ChangePassword,
  WrongResetTokenError,
  ResetPassword,
  RequestPasswordReset,
} from '@anyit/password-dto';
import { ActorRef, ActorSystem } from '@anyit/actor';
import { ErrorMessage } from '@anyit/messaging';
import { DateTime, Settings } from 'luxon';
import { UpdateRecord } from '@anyit/store-dto';
import { SendMessage } from '@anyit/messenger-dto';
import { PasswordActor } from '../src/password-actor';

const crypto = require('crypto');

Settings.defaultZone = 'utc';

const origToIso = DateTime.prototype.toISO;
DateTime.prototype.toISO = function () {
  const originalISO = origToIso.call(this) as any;
  const [noMills] = originalISO.split('.');
  return noMills;
};

describe('Given PasswordActor', () => {
  describe('When verifyUserCreation is called', () => {
    let actor: ActorRef;

    beforeEach(() => {
      actor = ActorSystem.create(PasswordActor, {
        store: {} as any,
        passwordRules: [new PasswordMinLengthRule(8)],
        hash: jest.fn(),
        verify: jest.fn(),
      });
    });

    describe('And a valid password is provided', () => {
      it('Then it passes without throwing an error', async () => {
        const message = new VerifyUserCreation({
          auth: { password: 'ValidPassword123!' },
          profile: {},
        });

        await expect(actor.ask(message)).resolves.not.toThrow();
      });
    });

    describe('And an invalid password is provided', () => {
      it('Then it throws an InvalidPasswordError', async () => {
        const message = new VerifyUserCreation({
          auth: { password: 'short' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeInstanceOf(InvalidPasswordError);
      });
    });
  });

  describe('When createPassword is called', () => {
    let actor: ActorRef;
    let store: ActorRef;
    let hash: jest.Mock;

    beforeEach(() => {
      store = {} as ActorRef;
      store.ask = jest
        .fn()
        .mockResolvedValue({ error: null, response: {}, reason: { id: 1 } });
      hash = jest.fn().mockReturnValue('hashedPassword');

      actor = ActorSystem.create(PasswordActor, {
        store,
        passwordRules: [new PasswordMinLengthRule(8)],
        hash,
        verify: jest.fn(),
      });
    });

    describe('And a new password is provided', () => {
      it('Then it hashes the password and stores the hash', async () => {
        const message = new CreateUser({
          auth: { password: 'NewPassword123!' },
          profile: {},
        });

        await actor.ask(message);

        expect(hash).toHaveBeenCalledWith('NewPassword123!');

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: expect.objectContaining({ passwordHash: 'hashedPassword' }),
          }),
        );
      });
    });

    describe('And a password hash is provided', () => {
      it('Then it directly stores the provided hash without hashing', async () => {
        const message = new CreateUser({
          auth: { passwordHash: 'providedHash' },
          profile: {},
        });

        await actor.ask(message);

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: expect.objectContaining({ passwordHash: 'providedHash' }),
          }),
        );
        expect(jest.requireMock('argon2').hash).not.toHaveBeenCalled();
      });
    });

    describe('And an error storing the hash is encountered', () => {
      it('Then it throws an error', async () => {
        const storeError = new Error('Store error');
        (store.ask as jest.Mock).mockResolvedValueOnce({
          error: storeError,
          response: new ErrorMessage({ error: storeError }),
        });

        const message = new CreateUser({
          auth: { password: 'NewPassword123!' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBe(storeError);
      });
    });
  });

  describe('When deleteUser is called', () => {
    let actor: ActorRef;
    let store: ActorRef;

    beforeEach(() => {
      store = {} as ActorRef;
      store.ask = jest.fn();

      actor = ActorSystem.create(PasswordActor, {
        store,
        passwordRules: [new PasswordMinLengthRule(8)],
      });
    });

    describe('And a user ID is provided', () => {
      it('Then it sends a DeleteRecord message to the store', async () => {
        const message = new DeleteUser({ id: 1 });

        await actor.ask(message);

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: { id: 1 },
          }),
        );
      });
    });

    describe('And an error from the store is encountered', () => {
      it('Then it throws the error', async () => {
        const storeError = new Error('Store error');
        (store.ask as jest.Mock).mockResolvedValueOnce({
          error: storeError,
          response: new ErrorMessage({ error: storeError }),
        });

        const message = new DeleteUser({ id: 1 });

        const { error } = await actor.ask(message);
        await expect(error).toBe(storeError);
      });
    });
  });

  describe('When signin is called', () => {
    let actor: ActorRef;
    let store: ActorRef;
    let verify: jest.Mock;

    beforeEach(() => {
      store = {} as ActorRef;
      store.ask = jest.fn();
      verify = jest.fn();

      actor = ActorSystem.create(PasswordActor, {
        store,
        passwordRules: [new PasswordMinLengthRule(8)],
        verify,
      });
    });

    describe('And valid credentials are provided', () => {
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValue({
          error: null,
          reason: { record: { passwordHash: 'hashed_password' } },
          response: {},
        });

        verify.mockResolvedValueOnce(true);
      });

      it("Then it verifies the user's password successfully", async () => {
        const message = new SignInUser({
          id: 1,
          auth: { password: 'test_password' },
          refreshTokenId: 1,
        });

        await actor.ask(message);

        expect(verify).toHaveBeenCalledWith('hashed_password', 'test_password');
      });
    });

    describe('And an invalid password is provided', () => {
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValue({
          error: null,
          reason: { record: { passwordHash: 'hashed_password' } },
          response: {},
        });

        verify.mockResolvedValue(false);
      });

      it('Then it throws a WrongPasswordError', async () => {
        const message = new SignInUser({
          id: 1,
          auth: { password: 'wrong_password' },
          refreshTokenId: 1,
        });

        const { error } = await actor.ask(message);
        expect(error).toBeInstanceOf(WrongPasswordError);
      });
    });

    describe('And a user has no password record', () => {
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValue({
          error: null,
          reason: { record: null },
          response: {},
        });
      });

      it('Then it throws a MissingPasswordError', async () => {
        const message = new SignInUser({
          id: 1,
          auth: { password: 'test_password' },
          refreshTokenId: 1,
        });

        const { error } = await actor.ask(message);
        expect(error).toBeInstanceOf(MissingPasswordError);
      });
    });
  });

  describe('When changePassword is called', () => {
    let actor: ActorRef;
    let store: ActorRef;
    let hash: jest.Mock;

    beforeEach(() => {
      store = {} as ActorRef;
      store.ask = jest.fn();
      hash = jest.fn().mockReturnValue('hashedPassword');

      actor = ActorSystem.create(PasswordActor, {
        store,
        passwordRules: [new PasswordMinLengthRule(8)],
        hash,
      });
    });

    describe('And a valid request is provided', () => {
      beforeEach(() => {
        hash.mockResolvedValueOnce('hashed_new_password');
        (store.ask as jest.Mock).mockResolvedValue({
          error: null,
          response: {},
        });
      });

      it('Then it hashes the new password and updates the store successfully', async () => {
        const message = new ChangePassword({ id: 1, password: 'new_password' });

        await actor.ask(message);

        expect(hash).toHaveBeenCalledWith('new_password');
        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: { id: 1, passwordHash: 'hashed_new_password' },
          }),
        );
      });
    });

    describe('And hashing fails', () => {
      beforeEach(() => {
        hash.mockRejectedValue(new Error('Hashing failed'));
      });

      it('Then it throws an error', async () => {
        const message = new ChangePassword({ id: 1, password: 'new_password' });
        const { error } = await actor.ask(message);

        expect(error?.message).toBe('Hashing failed');
      });
    });

    describe('And store update fails', () => {
      beforeEach(() => {
        hash.mockResolvedValue('hashed_new_password');
        (store.ask as jest.Mock).mockResolvedValue({
          error: new Error('Update failed'),
          response: {},
        });
      });

      it('Then it throws an error from the store', async () => {
        const message = new ChangePassword({ id: 1, password: 'new_password' });
        const { error } = await actor.ask(message);

        expect(error?.message).toBe('Update failed');
      });
    });
  });

  describe('When resetPassword is called', () => {
    let actor: ActorRef;
    let store: ActorRef;
    let hash: jest.Mock;
    let resetMessenger: ActorRef;

    beforeEach(() => {
      store = {} as ActorRef;
      store.ask = jest.fn();
      resetMessenger = {} as ActorRef;
      resetMessenger.ask = jest.fn();
      hash = jest.fn().mockReturnValue('hashedPassword');

      actor = ActorSystem.create(PasswordActor, {
        store,
        passwordRules: [new PasswordMinLengthRule(8)],
        hash,
        resetPasswordMessenger: resetMessenger,
      });
    });

    describe('And valid resetToken and password is provided', () => {
      const validResetToken = 'validToken';
      const newPassword = 'newSecurePassword';
      const hashedPassword = 'hashedNewPassword';
      const userId = 1;

      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValue({
          error: null,
          reason: {
            record: {
              id: userId,
              resetToken: validResetToken,
              resetTokenExpiresAt: DateTime.utc().plus({ days: 1 }),
            },
          },
        });

        hash.mockResolvedValue(hashedPassword);
      });

      it('Then it successfully resets the password', async () => {
        await actor.ask(
          new ResetPassword({
            id: userId,
            password: newPassword,
            resetToken: validResetToken,
          }),
        );

        // Verify the new password is hashed
        expect(hash).toHaveBeenCalledWith(newPassword);
        // Verify the store is called to update the user's password
        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: expect.objectContaining({
              id: userId,
              passwordHash: hashedPassword,
            }),
          }),
        );
      });

      it('Then it should call resetMessenger', async () => {
        await actor.ask(
          new ResetPassword({
            id: userId,
            password: newPassword,
            resetToken: validResetToken,
          }),
        );

        expect(resetMessenger.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            from: { id: 1 },
            to: [{ id: 1 }],
            code: SendMessage.code,
          }),
        );
      });
    });

    describe('And expired resetToken is provided', () => {
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValueOnce({
          error: null,
          reason: {
            record: {
              id: 1,
              resetToken: 'expiredToken',
              resetTokenExpiresAt: DateTime.utc().minus({ days: 1 }),
            },
          },
        });
      });

      it('Then it throws WrongResetTokenError', async () => {
        const { error } = await actor.ask(
          new ResetPassword({
            id: 1,
            password: 'newPassword',
            resetToken: 'expiredToken',
          }),
        );

        expect(error).toBeInstanceOf(WrongResetTokenError);
      });
    });

    describe('And invalid resetToken is provided', () => {
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValueOnce({
          error: null,
          reason: {
            record: {
              id: 1,
              resetToken: 'otherToken',
              resetTokenExpiresAt: DateTime.utc().plus({ days: 1 }),
            },
          },
        });
      });

      it('Then it throws WrongResetTokenError', async () => {
        const { error } = await actor.ask(
          new ResetPassword({
            id: 1,
            password: 'newPassword',
            resetToken: 'invalidToken',
          }),
        );

        expect(error).toBeInstanceOf(WrongResetTokenError);
      });
    });
  });

  describe('When requestPasswordReset is called', () => {
    let actor: ActorRef;
    let store: ActorRef;
    let requestMessenger: ActorRef;

    beforeEach(() => {
      store = {} as ActorRef;
      requestMessenger = {} as ActorRef;

      store.ask = jest.fn();
      requestMessenger.ask = jest.fn();

      actor = ActorSystem.create(PasswordActor, {
        store,
        passwordRules: [new PasswordMinLengthRule(8)],
        resetTokenExpireMs: 2000,
        requestPasswordResetMessenger: requestMessenger,
      });
    });

    describe('And a valid user ID is provided', () => {
      const userID = 1;
      const resetToken = 'resetToken123';
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValue({
          reason: { record: { id: userID } },
          response: {},
        });

        jest.spyOn(crypto, 'randomUUID').mockReturnValue(resetToken as any);
      });

      it('Then it should generate a reset token and update the user record', async () => {
        await actor.ask(new RequestPasswordReset({ id: userID }));

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: expect.objectContaining({
              id: userID,
              resetToken,
              resetTokenExpiresAt: DateTime.utc()
                .plus({ millisecond: 2000 })
                .toISO(),
            }),
            code: UpdateRecord.code,
          }),
        );
      });

      it('Then it should call requestMessenger', async () => {
        await actor.ask(new RequestPasswordReset({ id: userID }));

        expect(requestMessenger.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            from: { id: 1 },
            to: [{ id: 1 }],
            payload: {
              resetToken,
            },
            code: SendMessage.code,
          }),
        );
      });
    });

    describe('And a non-existing user ID is provided', () => {
      beforeEach(() => {
        (store.ask as jest.Mock).mockResolvedValueOnce({
          reason: {},
          response: {},
        });
      });

      it('Then it should throw a MissingPasswordError', async () => {
        const { error } = await actor.ask(
          new RequestPasswordReset({ id: 999 }),
        );

        expect(error).toBeInstanceOf(MissingPasswordError);
      });
    });
  });
});
