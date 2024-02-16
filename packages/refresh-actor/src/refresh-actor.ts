import { Actor, ActorArgs, ActorRef } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import {
  CreateRefresh,
  DeleteRefresh,
  GetTokenId,
  MaxRefreshTokensLimitError,
  MissingRefreshTokenError,
  Refresh,
  RevokeRefresh,
  VerifyRefresh,
} from '@anyit/refresh-dto';
import {
  CreateRecord,
  DeleteRecord,
  GetNextIdIncremented,
  GetRecord,
  GetRecords,
} from '@anyit/store-dto';
import { DeleteUser } from '@anyit/auth-actor-dto';

export type PasswordActorArgs = ActorArgs & {
  store: ActorRef;
  maxTokensLimit?: number;
};

export class RefreshActor extends Actor {
  constructor(args: PasswordActorArgs) {
    super(args);

    this.store = args.store;
    this.maxTokensLimit = args.maxTokensLimit ?? 0;
  }

  private readonly store: ActorRef;

  private readonly maxTokensLimit: number;

  async createRefresh(@Receive message: CreateRefresh) {
    const { traceId, id, tokenId, accessClaims } = message;

    if (this.maxTokensLimit > 0) {
      const { error, reason: getRecords } = await this.store.ask(
        new GetRecords<Refresh>({
          traceId,
          reason: message,
          filter: {
            identityId: id,
          },
          sender: this.constructor.name,
        }),
      );

      if (error) {
        throw error;
      }

      if (getRecords.records.length > this.maxTokensLimit) {
        throw new MaxRefreshTokensLimitError();
      }
    }

    const { error, reason: createRecord } = await this.store.ask(
      new CreateRecord<Refresh>({
        traceId,
        record: {
          id: tokenId ?? undefined,
          identityId: id,
          accessClaims,
        },
        reason: message,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    message.tokenId = createRecord.id;
  }

  async verifyRefresh(@Receive message: VerifyRefresh) {
    const { traceId, tokenId } = message;

    const { error, reason: verifyRefresh } = await this.store.ask(
      new GetRecord<Refresh>({
        traceId,
        filter: {
          id: tokenId,
        },
        reason: message,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    if (!verifyRefresh.record) {
      throw new MissingRefreshTokenError();
    }

    message.identityId = verifyRefresh.record.identityId;
  }

  async deleteRefresh(@Receive message: DeleteRefresh) {
    const { traceId, id } = message;
    const { error } = await this.store.ask(
      new DeleteRecord<Refresh>({
        traceId,
        filter: {
          identityId: id,
        },
        reason: message,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }
  }

  async revokeRefresh(@Receive message: RevokeRefresh) {
    const { traceId, id, tokenId } = message;
    const { error } = await this.store.ask(
      new DeleteRecord<Refresh>({
        traceId,
        filter: {
          identityId: id,
          id: tokenId,
        },
        reason: message,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }
  }

  async deleteUser(@Receive message: DeleteUser) {
    const { traceId, id } = message;
    const { error } = await this.store.ask(
      new DeleteRecord({
        traceId,
        filter: {
          identityId: id,
        },
        reason: message,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }
  }

  async getTokenId(@Receive message: GetTokenId) {
    const { traceId } = message;

    const { error, reason: getNextIdIncremented } = await this.store.ask(
      new GetNextIdIncremented({
        traceId,
        reason: message,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }

    message.tokenId = getNextIdIncremented.nextId;
  }
}
