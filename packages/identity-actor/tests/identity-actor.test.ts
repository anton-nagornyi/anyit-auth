import '@anyit/be-dev';
import { ActorRef, ActorSystem } from '@anyit/actor';
import {
  LockIdentity,
  SetActiveIdentity,
  UnlockIdentity,
  WrongArgumentValueError,
  MissingIdentityError,
  IdentityInactiveError,
  IdentityLockedError,
  UnlockIdentitiesPeriodically,
} from '@anyit/identity-dto';
import {
  CreateUser,
  RefreshAccessToken,
  SignInUser,
  VerifyUserCreation,
} from '@anyit/auth-actor-dto';
import { CreateRecord, LessThan, UpdateRecord } from '@anyit/store-dto';
import { DateTime } from 'luxon';
import { IdentityActor } from '../src/identity-actor';

describe('Given IdentityActor', () => {
  let actor: ActorRef;
  let store: ActorRef;

  beforeEach(() => {
    store = { ask: jest.fn() } as any;
    actor = ActorSystem.create(IdentityActor, { store });
  });

  describe('When verifyUserCreation', () => {
    describe('And the input is valid', () => {
      it('Then no error is thrown', async () => {
        const message = new VerifyUserCreation({
          auth: {
            username: 'validUsername',
            isActive: true,
            isLockedOut: false,
            lastIPAddress: '192.168.1.1',
            lockOutEndsAt: '2023-01-01T00:00:00Z',
          },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeUndefined();
      });
    });

    describe('And isActive is invalid', () => {
      it('Then throws WrongArgumentValue error for isActive', async () => {
        const message = new VerifyUserCreation({
          auth: { isActive: 'notBoolean' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeInstanceOf(WrongArgumentValueError);
      });
    });

    describe('And isLockedOut is invalid', () => {
      it('Then throws WrongArgumentValue error for isLockedOut', async () => {
        const message = new VerifyUserCreation({
          auth: { isLockedOut: 'notBoolean' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeInstanceOf(WrongArgumentValueError);
      });
    });

    describe('And lastIPAddress is invalid', () => {
      it('Then throws WrongArgumentValue error for lastIPAddress', async () => {
        const message = new VerifyUserCreation({
          auth: { lastIPAddress: 'notAnIPAddress' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeInstanceOf(WrongArgumentValueError);
      });
    });

    describe('And lockOutEndsAt is invalid', () => {
      it('Then throws WrongArgumentValue error for lockOutEndsAt', async () => {
        const message = new VerifyUserCreation({
          auth: { lockOutEndsAt: 'notADateTime' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeInstanceOf(WrongArgumentValueError);
      });
    });

    describe('And lastIPAddress is a valid IPv4 address', () => {
      it('Then does not throw an error', async () => {
        const message = new VerifyUserCreation({
          auth: { lastIPAddress: '192.168.1.1' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeUndefined();
      });
    });

    describe('And lastIPAddress is a valid IPv6 address', () => {
      it('Then does not throw an error', async () => {
        const message = new VerifyUserCreation({
          auth: { lastIPAddress: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
          profile: {},
        });

        const { error } = await actor.ask(message);

        expect(error).toBeUndefined();
      });
    });
  });

  describe('When createIdentity', () => {
    describe('And creating a new identity with valid data', () => {
      const createUserMessage = new CreateUser({
        traceId: 'trace123',
        auth: {
          isActive: true,
          isLockedOut: false,
          lastIPAddress: '127.0.0.1',
        },
        profile: {},
      });

      beforeEach(() => {
        store.ask = jest.fn().mockReturnValue({
          response: {},
          reason: { ...createUserMessage, id: 1 },
        });
      });

      it('Then successfully creates the identity and returns an ID', async () => {
        const { reason } = await actor.ask(createUserMessage);

        expect(reason.id).toBe(1);

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            code: CreateRecord.code,
            record: expect.objectContaining({
              isActive: true,
              isLockedOut: false,
              lastIPAddress: '127.0.0.1',
            }),
          }),
        );
      });
    });

    describe('And the auth object contains additional identity properties', () => {
      it('Then it includes these properties in the identity creation', async () => {
        const createUserMessage = new CreateUser({
          traceId: 'trace456',
          auth: {
            isActive: false,
            isLockedOut: true,
            lastIPAddress: '192.168.1.1',
            lockOutEndsAt: null,
          },
          profile: {},
        });

        await actor.ask(createUserMessage);
        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: expect.objectContaining({
              isActive: false,
              isLockedOut: true,
              lastIPAddress: '192.168.1.1',
              lockOutEndsAt: null,
            }),
          }),
        );
      });
    });

    describe('And missing optional fields in the auth object', () => {
      it('Then uses default values for missing fields', async () => {
        const createUserMessage = new CreateUser({
          traceId: 'trace789',
          auth: {},
          profile: {},
        });

        await actor.ask(createUserMessage);
        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            record: expect.objectContaining({
              isActive: false,
              isLockedOut: false,
              lastIPAddress: null,
              lockOutEndsAt: null,
            }),
          }),
        );
      });
    });

    describe('And creation fails due to store rejection', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(new Error('Store rejection'));
      });

      it('Then throws an error', async () => {
        const createUserMessage = new CreateUser({
          traceId: 'trace000',
          auth: {
            isActive: true,
            isLockedOut: false,
            lastIPAddress: '127.0.0.1',
          },
          profile: {},
        });

        const { error } = await actor.ask(createUserMessage);
        expect(error?.message).toBe('Store rejection');
      });
    });
  });

  describe('When signInUser', () => {
    describe('And signing in with valid credentials', () => {
      it('Then successfully retrieves user identity and assigns an ID', async () => {
        store.ask = jest.fn().mockResolvedValue({
          error: null,
          reason: {
            record: {
              id: 1,
              username: 'testUser',
            },
          },
        });

        const signInMessage = new SignInUser({
          traceId: 'trace123',
          id: 1,
          auth: { username: 'testUser' },
          refreshTokenId: 1,
        });

        await actor.ask(signInMessage);

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: { id: 1 },
          }),
        );
        expect(signInMessage).toHaveProperty('id', 1);
      });
    });

    describe('And the identity is inactive', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockResolvedValue({
          error: null,
          reason: {
            record: {
              id: 1,
              isActive: false,
              isLockedOut: false,
            },
          },
          response: {},
        });
      });

      it('Then it throws an IdentityInactiveError', async () => {
        const signInMessage = new SignInUser({
          traceId: 'trace456',
          auth: { username: 'nonexistentUser' },
          refreshTokenId: 1,
        });

        const { error } = await actor.ask(signInMessage);

        expect(error).toBeInstanceOf(IdentityInactiveError);
      });
    });

    describe('And the identity is locked out', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockResolvedValue({
          error: null,
          reason: {
            record: {
              id: 1,
              isActive: true,
              isLockedOut: true,
            },
          },
          response: {},
        });
      });

      it('Then it throws an IdentityLockedError', async () => {
        const signInMessage = new SignInUser({
          traceId: 'trace456',
          auth: { username: 'nonexistentUser' },
          refreshTokenId: 1,
        });

        const { error } = await actor.ask(signInMessage);

        expect(error).toBeInstanceOf(IdentityLockedError);
      });
    });

    describe('And signing in with a username that does not exist', () => {
      it('Then throws a MissingUsernameError', async () => {
        store.ask = jest.fn().mockResolvedValue({
          error: null,
          reason: { record: null },
          response: {},
        });

        const signInMessage = new SignInUser({
          traceId: 'trace456',
          auth: { username: 'nonexistentUser' },
          refreshTokenId: 1,
        });

        const { error } = await actor.ask(signInMessage);

        expect(error).toBeInstanceOf(MissingIdentityError);
      });
    });

    describe('And store interaction fails', () => {
      it('Then propagates the error from the store', async () => {
        const storeError = new Error('Store error');
        store.ask = jest.fn().mockRejectedValue(storeError);

        const signInMessage = new SignInUser({
          traceId: 'trace789',
          auth: { username: 'testUser' },
          refreshTokenId: 1,
        });

        const { error } = await actor.ask(signInMessage);
        expect(error).toBe(storeError);
      });
    });
  });

  describe('When signInUpdate', () => {
    const traceId = 'unique-trace-id';
    const id = 1;
    const lastIPAddress = '127.0.0.1';
    const signInUserMessage = new SignInUser({
      id,
      traceId,
      auth: { lastIPAddress },
      refreshTokenId: 1,
    });

    describe('And updating sign-in information is successful', () => {
      beforeEach(() => {
        store.ask = jest
          .fn()
          .mockResolvedValueOnce({
            error: null,
            reason: {
              record: {
                id: 1,
                username: 'testUser',
                isActive: true,
                isLockedOut: false,
              },
            },
            response: {},
          })
          .mockResolvedValue({
            error: null,
            reason: {},
            response: {},
          });
      });

      it('Then calls store with correct parameters', async () => {
        await actor.ask(signInUserMessage);

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            traceId,
            code: UpdateRecord.code,
            reason: signInUserMessage,
            record: expect.objectContaining({
              lastIPAddress,
              lastLoginAt: expect.any(DateTime),
              lastSeenAt: expect.any(DateTime),
            }),
            filter: {
              id,
            },
          }),
        );
      });
    });

    describe('And store interaction fails', () => {
      const storeError = new Error('Store interaction failed');

      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(storeError);
      });

      it('Then propagates the error', async () => {
        const { error } = await actor.ask(signInUserMessage);

        expect(error).toBe(storeError);
      });
    });
  });

  describe('When lockIdentity', () => {
    const traceId = 'unique-trace-id';
    const id = 1;
    const lockForSeconds = 3600; // 1 hour
    const lockIdentityMessage = new LockIdentity({
      id,
      traceId,
      lockForSeconds,
    });

    describe('And locking the identity is successful', () => {
      beforeEach(() => {
        store.ask = jest
          .fn()
          .mockResolvedValue({ error: null, response: 'Mock response' });
      });

      it('Then calls store with correct update parameters', async () => {
        await actor.ask(lockIdentityMessage);

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            traceId,
            reason: lockIdentityMessage,
            record: expect.objectContaining({
              isLockedOut: true,
              lockOutEndsAt: expect.any(DateTime),
              lastModifiedAt: expect.any(DateTime),
            }),
            filter: {
              id,
            },
          }),
        );
      });
    });

    describe('And store interaction fails', () => {
      const storeError = new Error('Store interaction failed');

      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(storeError);
      });

      it('Then propagates the error', async () => {
        const { error } = await actor.ask(lockIdentityMessage);

        expect(error).toBe(storeError);
      });
    });
  });

  describe('When setActiveIdentity', () => {
    const traceId = 'unique-trace-id';
    const id = 123;

    describe('And setting an identity as active', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockResolvedValue({ error: null, response: {} });
      });

      it('Then it calls the store with correct parameters for activation', async () => {
        await actor.ask(new SetActiveIdentity({ id, traceId, isActive: true }));

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            code: UpdateRecord.code,
            record: expect.objectContaining({
              isActive: true,
            }),
            filter: {
              id,
            },
            sender: 'IdentityActor',
          }),
        );
      });
    });

    describe('And setting an identity as inactive', () => {
      it('Then it calls the store with correct parameters for deactivation', async () => {
        await actor.ask(
          new SetActiveIdentity({ id, traceId, isActive: false }),
        );

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            code: UpdateRecord.code,
            record: expect.objectContaining({
              isActive: false,
            }),
            filter: {
              id,
            },
          }),
        );
      });
    });

    describe('And the store operation fails', () => {
      const storeError = new Error('Failed to update identity');

      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(storeError);
      });

      it('Then it throws an error for failed activation attempts', async () => {
        const { error } = await actor.ask(
          new SetActiveIdentity({ id, traceId, isActive: true }),
        );

        expect(error).toBe(storeError);
      });

      it('Then it throws an error for failed deactivation attempts', async () => {
        const { error } = await actor.ask(
          new SetActiveIdentity({ id, traceId, isActive: false }),
        );

        expect(error).toBe(storeError);
      });
    });
  });

  describe('When unlockIdentity', () => {
    const traceId = 'unique-trace-id';
    const id = 123;

    describe('And unlocking an identity', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockResolvedValue({ error: null, response: {} });
      });

      it('Then it calls the store with correct parameters', async () => {
        await actor.ask(new UnlockIdentity({ id, traceId }));

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            code: UpdateRecord.code,
            record: expect.objectContaining({
              isLockedOut: false,
              lockOutEndsAt: null,
            }),
            filter: {
              id,
            },
            sender: 'IdentityActor',
          }),
        );
      });
    });

    describe('And the store operation fails', () => {
      const storeError = new Error('Failed to unlock identity');

      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(storeError);
      });

      it('Then it throws an error', async () => {
        const { error } = await actor.ask(new UnlockIdentity({ id, traceId }));

        expect(error).toBe(storeError);
      });
    });
  });

  describe('When unlockIdentitiesPeriodically', () => {
    const traceId = 'unique-trace-id';
    const id = 123;

    describe('And unlocking an identities', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockResolvedValue({ error: null, response: {} });
      });

      it('Then it calls the store with correct parameters', async () => {
        await actor.ask(new UnlockIdentitiesPeriodically());

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            code: UpdateRecord.code,
            record: expect.objectContaining({
              isLockedOut: false,
              lockOutEndsAt: null,
            }),
            filter: {
              lockOutEndsAt: expect.any(LessThan),
            },
            sender: 'IdentityActor',
          }),
        );
      });
    });

    describe('And the store operation fails', () => {
      const storeError = new Error('Failed to unlock identity');

      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(storeError);
      });

      it('Then it throws an error', async () => {
        const { error } = await actor.ask(new UnlockIdentitiesPeriodically({}));

        expect(error).toBe(storeError);
      });
    });
  });

  describe('When seeIdentity', () => {
    const traceId = 'unique-trace-id';
    const id = 123;
    const ipAddress = '192.168.1.1';

    describe('And updating the last seen info of an identity', () => {
      beforeEach(() => {
        store.ask = jest.fn().mockResolvedValue({ error: null, response: {} });
      });

      it('Then it calls the store with correct parameters', async () => {
        await actor.ask(
          new RefreshAccessToken({
            id,
            traceId,
            ipAddress,
            refreshToken: 'refresh-token',
          }),
        );

        expect(store.ask).toHaveBeenCalledWith(
          expect.objectContaining({
            code: UpdateRecord.code,
            record: expect.objectContaining({
              lastIPAddress: ipAddress,
              lastSeenAt: expect.anything(),
            }),
            filter: {
              id,
            },
            sender: 'IdentityActor',
          }),
        );
      });
    });

    describe('And the store operation fails', () => {
      const storeError = new Error('Failed to update last seen info');

      beforeEach(() => {
        store.ask = jest.fn().mockRejectedValue(storeError);
      });

      it('Then it throws an error', async () => {
        const { error } = await actor.ask(
          new RefreshAccessToken({
            id,
            traceId,
            ipAddress,
            refreshToken: 'refresh-token',
          }),
        );

        expect(error).toBe(storeError);
      });
    });
  });
});
