import '@anyit/be-dev';
import { ActorRef, ActorSystem } from '@anyit/actor';
import {
  CreateRefresh,
  DeleteRefresh,
  GetTokenId,
  MaxRefreshTokensLimitError,
  MissingRefreshTokenError,
  RevokeRefresh,
  VerifyRefresh,
} from '@anyit/refresh-dto';
import { CreateRecord, GetRecord } from '@anyit/store-dto';
import { DeleteUser } from '@anyit/auth-actor-dto';
import { RefreshActor } from '../src/refresh-actor';

describe('Given a RefreshActor with a maxTokensLimit', () => {
  let refreshActor: ActorRef;
  let store: ActorRef;

  beforeEach(() => {
    store = { ask: jest.fn() } as any;
    refreshActor = ActorSystem.create(RefreshActor, {
      store,
      maxTokensLimit: 5,
    });
  });

  describe('When createRefresh is called and the token limit is not exceeded', () => {
    beforeEach(() => {
      store.ask = jest
        .fn()
        .mockResolvedValueOnce({
          reason: { records: Array(4).fill({}) },
        })
        .mockResolvedValueOnce({
          reason: { id: 2 },
        });
    });

    it('Then it should create a new refresh token', async () => {
      const message = new CreateRefresh({
        id: 'userId',
        tokenId: 2,
        accessClaims: {},
      });

      await refreshActor.ask(message);

      expect(store.ask).toHaveBeenCalledWith(expect.any(CreateRecord));
      expect(message.tokenId).toBe(2);
    });
  });

  describe('When createRefresh is called and the token limit is exceeded', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValueOnce({
        reason: { records: Array(6).fill({}) },
      });
    });

    it('Then it should throw MaxRefreshTokensLimitError', async () => {
      const message = new CreateRefresh({
        id: 'userId',
        tokenId: 3,
        accessClaims: {},
      });
      const { error } = await refreshActor.ask(message);

      expect(error).toBeInstanceOf(MaxRefreshTokensLimitError);
    });
  });

  describe('When verifyRefresh is called with an existing token ID', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({
        reason: { record: { identityId: 4 } },
      });
    });

    it('Then it should verify the refresh token', async () => {
      const message = new VerifyRefresh({ tokenId: 'existingTokenId' });

      await refreshActor.ask(message);

      expect(store.ask).toHaveBeenCalledWith(expect.any(GetRecord));
      expect(message.identityId).toBe(4);
    });
  });

  describe('When verifyRefresh is called with a non-existing token ID', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({ reason: {} });
    });

    it('Then it should throw MissingRefreshTokenError', async () => {
      const message = new VerifyRefresh({ tokenId: 'nonExistingTokenId' });

      const { error } = await refreshActor.ask(message);
      expect(error).toBeInstanceOf(MissingRefreshTokenError);
    });
  });

  describe('When deleteRefresh is called with a valid ID', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({}); // Simulate successful deletion
    });

    it('Then it should call store with DeleteRecord message', async () => {
      const message = new DeleteRefresh({ id: 7 });

      await refreshActor.ask(message);

      expect(store.ask).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DeleteRecord',
          filter: { identityId: 7 },
        }),
      );
    });
  });

  describe('When deleteRefresh encounters a store error', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockRejectedValue(new Error('Store error'));
    });

    it('Then it should throw the encountered error', async () => {
      const message = new DeleteRefresh({ id: 'userId' });

      const { error } = await refreshActor.ask(message);
      expect(error?.message).toBe('Store error');
    });
  });

  describe('When revokeRefresh is called with valid identity and token IDs', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({});
    });

    it('Then it should instruct the store to delete the specific refresh token', async () => {
      const revokeRefreshMessage = new RevokeRefresh({
        traceId: 'traceId',
        id: 3,
        tokenId: 7,
      });

      await refreshActor.ask(revokeRefreshMessage);

      expect(store.ask).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DeleteRecord',
          filter: {
            identityId: 3,
            id: 7,
          },
        }),
      );
    });
  });

  describe('When revokeRefresh is called and the store encounters an error', () => {
    beforeEach(() => {
      store.ask = jest
        .fn()
        .mockRejectedValue(new Error('Store operation failed'));
    });

    it('Then it should throw an error', async () => {
      const revokeRefreshMessage = new RevokeRefresh({
        traceId: 'traceId',
        id: 3,
        tokenId: 7,
      });

      const { error } = await refreshActor.ask(revokeRefreshMessage);
      expect(error?.message).toBe('Store operation failed');
    });
  });

  describe('When deleteUser is called with a valid user ID', () => {
    beforeEach(() => {
      store.ask = jest.fn().mockResolvedValue({});
    });

    it('Then it should instruct the store to delete all refresh tokens associated with the user ID', async () => {
      const deleteUserMessage = new DeleteUser({
        traceId: 'traceId',
        id: 3,
      });

      await refreshActor.ask(deleteUserMessage);

      expect(store.ask).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DeleteRecord',
          filter: {
            identityId: 3,
          },
        }),
      );
    });
  });

  describe('When deleteUser is called and the store operation fails', () => {
    beforeEach(() => {
      store.ask = jest
        .fn()
        .mockRejectedValue(new Error('Store operation failed'));
    });

    it('Then it should throw an error', async () => {
      const deleteUserMessage = new DeleteUser({
        traceId: 'traceId',
        id: 7,
      });

      const { error } = await refreshActor.ask(deleteUserMessage);

      expect(error?.message).toBe('Store operation failed');
    });
  });

  describe('When getTokenId is called', () => {
    beforeEach(() => {
      store.ask = jest
        .fn()
        .mockResolvedValue({ reason: { nextId: 123 }, response: {} });
    });

    it('Then it should request the next ID from the store', async () => {
      const message = new GetTokenId({
        traceId: 'traceId-123',
      });

      await refreshActor.ask(message);

      expect(store.ask).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'GetNextIdIncremented',
        }),
      );
      expect(message.tokenId).toBe(123);
    });
  });

  describe('When the store fails to return the next ID', () => {
    beforeEach(() => {
      store.ask = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get next ID'));
    });

    it('Then it should throw an error', async () => {
      const message = new GetTokenId({
        traceId: 'traceId-456',
      });

      const { error } = await refreshActor.ask(message);
      expect(error?.message).toBe('Failed to get next ID');
    });
  });
});
