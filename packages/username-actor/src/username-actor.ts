import { Actor, ActorArgs, ActorRef } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import {
  MissingUsernameError,
  Username,
  WrongUsernameError,
} from '@anyit/username-dto';
import {
  CreateUser,
  DeleteUser,
  SignInUser,
  VerifyUserCreation,
} from '@anyit/auth-actor-dto';
import { CreateRecord, DeleteRecord, GetRecord } from '@anyit/store-dto';

export type VerifyingMethod = (username: string) => boolean;

export type UsernameActorArgs = ActorArgs & {
  store: ActorRef;
  verify?: VerifyingMethod;
};

export class UsernameActor extends Actor {
  constructor(args: UsernameActorArgs) {
    super(args);

    this.store = args.store;
    this.verify = args.verify ?? (() => true);
  }

  private readonly store: ActorRef;

  private readonly verify: VerifyingMethod;

  async verifyUserCreation(@Receive message: VerifyUserCreation) {
    const { auth } = message;

    if (!this.verify((auth.username as string) ?? '')) {
      throw new WrongUsernameError();
    }
  }

  async signInUser(@Receive message: SignInUser) {
    const { traceId, auth } = message;
    const {
      error,
      reason: username,
      response,
    } = await this.store.ask(
      new GetRecord<Username>({
        traceId,
        reason: message,
        filter: {
          username: auth.username as string,
        },
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    if (!username.record) {
      throw new MissingUsernameError();
    }

    this.emitToListeners(response);

    message.id = username.record.id;
  }

  async createUser(@Receive message: CreateUser) {
    const { traceId, auth } = message;

    const {
      error,
      reason: username,
      response,
    } = await this.store.ask(
      new CreateRecord<Username>({
        traceId,
        reason: message,
        record: {
          id: message.id ?? undefined,
          username: auth.username as string,
        },
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    this.emitToListeners(response);

    message.id = username.id;
  }

  async deleteUser(@Receive message: DeleteUser) {
    const { traceId, id } = message;

    const { error, response } = await this.store.ask(
      new DeleteRecord({
        traceId,
        reason: message,
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    this.emitToListeners(response);
  }
}
