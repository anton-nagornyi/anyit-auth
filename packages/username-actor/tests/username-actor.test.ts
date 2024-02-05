import '@anyit/be-dev';
import {
  CreateUser,
  DeleteUser,
  SignInUser,
  VerifyUserCreation,
} from '@anyit/auth-actor-dto';
import { MissingUsernameError, WrongUsernameError } from '@anyit/username-dto';
import { ActorRef, ActorSystem } from '@anyit/actor';
import { UsernameActor } from '../src/username-actor';

describe('Given a UsernameActor with a configured store', () => {
  let actor: ActorRef;
  let store: ActorRef;

  beforeEach(() => {
    store = {} as any;
    actor = ActorSystem.create(UsernameActor, {
      store,
      verify: (username) => username === 'validUsername',
    });
  });

  describe('When verifyUserCreation is called with a valid username', () => {
    it('Then it should not throw an error', async () => {
      const { error } = await actor.ask(
        new VerifyUserCreation({
          auth: { username: 'validUsername' },
          profile: {},
        }),
      );
      expect(error).toBeUndefined();
    });
  });

  describe('When verifyUserCreation is called with an invalid username', () => {
    it('Then it should throw a WrongUsernameError', async () => {
      const { error } = await actor.ask(
        new VerifyUserCreation({
          auth: { username: 'invalidUsername' },
          profile: {},
        }),
      );
      expect(error).toBeInstanceOf(WrongUsernameError);
    });
  });

  describe('When signInUser is called with an existing username', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({
        reason: { record: { id: 1, username: 'existingUser' } },
        response: {},
      });
    });

    it('Then it should not throw an error', async () => {
      const { error } = await actor.ask(
        new SignInUser({
          auth: { username: 'existingUser' },
          refreshTokenId: 1,
        }),
      );
      expect(error).toBeUndefined();
    });
  });

  describe('When signInUser is called with a non-existing username', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({
        reason: { record: null },
        response: {},
      });
    });

    it('Then it should throw a MissingUsernameError', async () => {
      const { error } = await actor.ask(
        new SignInUser({
          auth: { username: 'nonExistingUser' },
          refreshTokenId: 1,
        }),
      );
      expect(error).toBeInstanceOf(MissingUsernameError);
    });
  });

  describe('When createUser is called', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({
        reason: { id: 1 },
        response: {},
      });
    });

    it('Then it should create a user record and not throw an error', async () => {
      const { error } = await actor.ask(
        new CreateUser({ auth: { username: 'newUser' }, profile: {} }),
      );
      expect(error).toBeUndefined();

      expect(store.ask).toHaveBeenCalledWith(
        expect.objectContaining({
          record: expect.objectContaining({ username: 'newUser' }),
        }),
      );
    });
  });

  describe('When deleteUser is called with an existing user ID', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({
        reason: {},
        response: {},
      });
    });

    it('Then it should delete the user record and not throw an error', async () => {
      const { error } = await actor.ask(new DeleteUser({ id: 1 }));
      expect(error).toBeUndefined();

      expect(store.ask).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: expect.objectContaining({ id: 1 }),
        }),
      );
    });
  });
});
