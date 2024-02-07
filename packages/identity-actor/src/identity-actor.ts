import { Actor, ActorArgs, ActorRef } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import {
  Identity,
  IdentityInactiveError,
  IdentityLockedError,
  LockIdentity,
  SetActiveIdentity,
  UnlockIdentity,
  WrongArgumentValueError,
  MissingIdentityError,
  UnlockIdentitiesPeriodically,
} from '@anyit/identity-dto';
import { DateTime } from 'luxon';
import {
  CreateRecord,
  GetRecord,
  LessThan,
  UpdateRecord,
} from '@anyit/store-dto';
import {
  CreateUser,
  RefreshAccessToken,
  SignInUser,
  VerifyUserCreation,
} from '@anyit/auth-actor-dto';

export type IdentityActorArgs = ActorArgs & {
  store: ActorRef;
};

export class IdentityActor extends Actor {
  constructor(args: IdentityActorArgs) {
    super(args);

    this.store = args.store;
  }

  private readonly store: ActorRef;

  async verifyUserCreation(@Receive message: VerifyUserCreation) {
    const { auth } = message;
    const { isActive, isLockedOut, lastIPAddress, lockOutEndsAt } =
      auth as Partial<Identity>;

    if (isActive !== undefined && typeof isActive !== 'boolean') {
      throw new WrongArgumentValueError('isActive');
    }

    if (isLockedOut !== undefined && typeof isLockedOut !== 'boolean') {
      throw new WrongArgumentValueError('isLockedOut');
    }

    if (
      lastIPAddress !== undefined &&
      lastIPAddress !== null &&
      (typeof lastIPAddress !== 'string' || !this.isValidIP(lastIPAddress))
    ) {
      throw new WrongArgumentValueError('lastIPAddress');
    }

    if (
      lockOutEndsAt !== undefined &&
      lockOutEndsAt !== null &&
      (typeof lockOutEndsAt !== 'string' ||
        !DateTime.fromISO(lockOutEndsAt).isValid)
    ) {
      throw new WrongArgumentValueError('lockOutEndsAt');
    }
  }

  async createIdentity(@Receive message: CreateUser) {
    const { traceId, auth } = message;

    const {
      isActive = false,
      isLockedOut = false,
      lockOutEndsAt = null,
      lastIPAddress,
    } = auth as unknown as Identity;

    const { error, reason, response } = await this.store.ask(
      new CreateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          createdAt: DateTime.utc().toJSDate() as any,
          isActive,
          isLockedOut,
          lastLoginAt: null,
          lastIPAddress: lastIPAddress ?? null,
          lastModifiedAt: DateTime.utc().toJSDate() as any,
          lastSeenAt: null,
          lockOutEndsAt,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }

    message.id = reason.id;
  }

  async signInUser(@Receive message: SignInUser) {
    const { traceId } = message;
    const id = Number(message.id ?? '0');

    const {
      error,
      reason: getRecord,
      response,
    } = await this.store.ask(
      new GetRecord<Identity>({
        traceId,
        reason: message,
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }

    const { record } = getRecord;

    if (record) {
      if (!record.isActive) {
        throw new IdentityInactiveError();
      }

      if (record.isLockedOut) {
        throw new IdentityLockedError();
      }

      message.id = record.id;
    } else {
      throw new MissingIdentityError();
    }
  }

  async signInUpdate(@Receive message: SignInUser) {
    const { id, traceId, auth } = message;
    const { lastIPAddress = null } = auth as unknown as Identity;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          lastIPAddress,
          lastLoginAt: DateTime.utc(),
          lastSeenAt: DateTime.utc(),
        },
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  async lockIdentity(@Receive message: LockIdentity) {
    const { id, traceId, lockForSeconds } = message;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          isLockedOut: true,
          lockOutEndsAt: lockForSeconds
            ? DateTime.utc().plus({ seconds: lockForSeconds })
            : null,
          lastModifiedAt: DateTime.utc(),
        },
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  async setActiveIdentity(@Receive message: SetActiveIdentity) {
    const { id, traceId, isActive } = message;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          isActive,
          lastModifiedAt: DateTime.utc(),
        },
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  async unlockIdentity(@Receive message: UnlockIdentity) {
    const { id, traceId } = message;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          isLockedOut: false,
          lockOutEndsAt: null,
          lastModifiedAt: DateTime.utc(),
        },
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  async unlockIdentitiesPeriodically(
    @Receive message: UnlockIdentitiesPeriodically,
  ) {
    const { traceId } = message;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          isLockedOut: false,
          lockOutEndsAt: null,
          lastModifiedAt: DateTime.utc(),
        },
        filter: {
          lockOutEndsAt: new LessThan(DateTime.utc()),
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  async seeIdentity(@Receive message: RefreshAccessToken) {
    const { id, traceId, ipAddress } = message;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Identity>({
        traceId,
        reason: message,
        record: {
          lastIPAddress: ipAddress,
          lastSeenAt: DateTime.utc(),
        },
        filter: {
          id,
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  private isValidIPv4(ip: string) {
    const regExp =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regExp.test(ip);
  }

  private isValidIPv6(ip: string) {
    const regExp =
      /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|([0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}|((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|:)|([0-9a-fA-F]{1,4}:){5}((:[0-9a-fA-F]{1,4}){1,2}|:((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|:)|([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,3}|:((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|:)|([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,4}|:((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|:)|([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,5}|:((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|:)|([0-9a-fA-F]{1,4}:){1}((:[0-9a-fA-F]{1,4}){1,6}|:((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|:)|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    return regExp.test(ip);
  }

  private isValidIP(ip: string) {
    return this.isValidIPv4(ip) || this.isValidIPv6(ip);
  }
}
