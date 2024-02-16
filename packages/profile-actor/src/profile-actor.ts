import {
  Actor,
  ActorArgs,
  ActorRef,
  ActorSystem,
  Subscribe,
} from '@anyit/actor';
import {
  Receive,
  ReceiveFilter,
  ReceiveSuccess,
} from '@anyit/message-handling';
import {
  RegisterAuthenticationActor,
  RegisterAuthorizationActor,
  VerifyUserCreation,
} from '@anyit/auth-actor-dto';
import { SuccessMessage } from '@anyit/messaging';
import { CreateRecord, GetRecord, UpdateRecord } from '@anyit/store-dto';
import { GetProfile } from '@anyit/profile-dto';

type VerifyCreationHandler = (
  message: VerifyUserCreation,
) => Promise<void> | void;

export type ProfileActorArgs = ActorArgs & {
  store: ActorRef;
  verifyCreation?: VerifyCreationHandler;
};

export class ProfileActor extends Actor {
  constructor(args: ProfileActorArgs) {
    super(args);
    this.store = args.store;
    this.verifyCreation = args.verifyCreation;
  }

  private readonly allowedFields = new Set<string>();

  private readonly store: ActorRef;

  private readonly verifyCreation?: VerifyCreationHandler;

  @ReceiveFilter(RegisterAuthenticationActor, RegisterAuthorizationActor)
  registerAuthActor(
    message: RegisterAuthenticationActor | RegisterAuthorizationActor,
  ) {
    const { dataFields, address, traceId } = message;

    const actor = ActorSystem.getRef(address);

    actor.tell(
      new Subscribe({
        traceId,
        reason: message,
        messageTypes: [SuccessMessage],
        listener: ActorSystem.getRef(this.address),
        sender: this.constructor.name,
      }),
    );

    for (const { name } of dataFields) {
      this.allowedFields.add(name);
    }
  }

  async createRecord(@ReceiveSuccess message: CreateRecord) {
    const { record, traceId, id } = message;

    const filteredRecord = Object.fromEntries(
      Object.entries(record).filter(([key]) => this.allowedFields.has(key)),
    );

    const { reason: existingRecord } = await this.store.ask(
      new GetRecord<{ id: number }>({
        traceId,
        reason: message,
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    if (existingRecord.record) {
      this.store.tell(
        new UpdateRecord({
          traceId,
          reason: message,
          record: {
            ...existingRecord.record,
            ...filteredRecord,
          },
          filter: {
            id,
          },
          sender: this.constructor.name,
        }),
      );
    } else {
      this.store.tell(
        new CreateRecord({
          traceId,
          reason: message,
          record: {
            id,
            ...filteredRecord,
          },
          sender: this.constructor.name,
        }),
      );
    }
  }

  async updateRecord(@ReceiveSuccess message: UpdateRecord) {
    const { record, traceId } = message;

    const filteredRecord = Object.fromEntries(
      Object.entries(record).filter(([key]) => this.allowedFields.has(key)),
    );

    this.store.tell(
      new UpdateRecord({
        traceId,
        reason: message,
        record: {
          identity: {
            filteredRecord,
          },
        },
        filter: {
          id: record.id,
        },
        sender: this.constructor.name,
      }),
    );
  }

  async getProfile(@Receive message: GetProfile) {
    const { traceId, id } = message;

    const { error, reason: profile } = await this.store.ask(
      new GetRecord({
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

    message.profile = profile.record;
  }

  async verifyUserCreation(@Receive message: VerifyUserCreation) {
    if (this.verifyCreation) {
      await this.verifyCreation(message);
    }
  }
}
