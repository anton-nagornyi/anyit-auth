import '@anyit/be-dev';
import {
  RegisterAuthenticationActor,
  VerifyUserCreation,
} from '@anyit/auth-actor-dto';
import { ActorRef, ActorSystem, Subscribe } from '@anyit/actor';
import { CreateRecord } from '@anyit/store-dto';
import { SuccessMessage } from '@anyit/messaging';
import { ProfileActor } from '../src/profile-actor';

describe('Given ProfileActor', () => {
  let profileActor: ActorRef;
  let verifyCreation: jest.Mock;
  const store = { tell: jest.fn(), ask: jest.fn() };

  beforeEach(() => {
    verifyCreation = jest.fn();
    profileActor = ActorSystem.create(ProfileActor, {
      store: store as any,
      verifyCreation,
    });
  });

  describe('When registerAuthActor is called with RegisterAuthenticationActor message', () => {
    let authTell: jest.Mock;

    beforeEach(() => {
      authTell = jest.fn();
      ActorSystem.getRef = jest.fn().mockReturnValue({ tell: authTell });
    });

    it('Then it should subscribe to SuccessMessage types', async () => {
      const message = new RegisterAuthenticationActor({
        dataFields: [
          { name: 'username', type: 'string' },
          { name: 'email', type: 'string' },
        ],
        address: 'authActorAddress',
        traceId: 'trace123',
        authType: 'username-password',
      });
      await profileActor.ask(message);

      expect(ActorSystem.getRef).toHaveBeenCalledWith('authActorAddress');
      expect(authTell).toHaveBeenCalledWith(expect.any(Subscribe));
    });
  });

  describe('When createRecord is called with allowed fields', () => {
    beforeEach(async () => {
      profileActor = ActorSystem.create(ProfileActor, {
        store: store as any,
        verifyCreation,
      });

      const message = new RegisterAuthenticationActor({
        dataFields: [{ name: 'username', type: 'string' }],
        address: 'authActorAddress',
        traceId: 'trace123',
        authType: 'username-password',
      });
      await profileActor.ask(message);

      store.ask = jest.fn().mockResolvedValue({ reason: { record: null } });
      store.tell = jest.fn();

      profileActor.tell(
        new SuccessMessage({
          reason: new CreateRecord({
            record: {
              id: 1,
              username: 'testUser',
              email: 'test@example.com',
              password: 'secret',
            },
            traceId: 'trace123',
          }),
        }),
      );
    });

    it('Then it should filter out disallowed fields and create a record', () => {
      expect(store.tell).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'CreateRecord',
          record: {
            id: 0,
            username: 'testUser',
          },
        }),
      );
    });
  });

  describe('When verifyUserCreation is called with a verifyCreation handler', () => {
    it('Then it should call the verifyCreation handler', async () => {
      const message = new VerifyUserCreation({ id: 1 } as any);
      await profileActor.ask(message);
      expect(verifyCreation).toHaveBeenCalledWith(message);
    });
  });
});
