import { Actor, ActorArgs, ActorRef, ActorSystem } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import { verify, hash } from 'argon2';
import { DateTime } from 'luxon';
import { randomUUID } from 'crypto';
import {
  ChangePassword,
  InvalidPasswordError,
  MissingPasswordError,
  Password,
  PASSWORD_RESET_REQUEST_MESSENGER,
  PASSWORD_RESET_MESSENGER,
  PasswordMaxLengthRule,
  PasswordMinLengthRule,
  PasswordRule,
  RequestPasswordReset,
  ResetPassword,
  WrongPasswordError,
  WrongResetTokenError,
  InvalidPasswordHashError,
} from '@anyit/password-dto';
import {
  CreateUser,
  SignInUser,
  VerifyUserCreation,
  DeleteUser,
} from '@anyit/auth-actor-dto';
import {
  CreateRecord,
  GetRecord,
  UpdateRecord,
  DeleteRecord,
} from '@anyit/store-dto';
import { SendMessage } from '@anyit/messenger-dto';
import { Message } from '@anyit/messaging';

export type HashingMethod = (password: string) => Promise<string>;
export type VerifyingMethod = (
  hash: string,
  password: string,
) => Promise<boolean>;

export type PasswordActorArgs = ActorArgs & {
  store: ActorRef;
  requestPasswordResetMessenger?: ActorRef | null;
  resetPasswordMessenger?: ActorRef | null;
  hash?: HashingMethod;
  verify?: VerifyingMethod;
  passwordRules?: PasswordRule[];
  resetTokenExpireMs?: number;
};

export class PasswordActor extends Actor {
  constructor(args: PasswordActorArgs) {
    super(args);

    this.store = args.store;
    this.hash = args.hash ?? hash;
    this.verify = args.verify ?? verify;
    this.passwordRules = args.passwordRules
      ? [...args.passwordRules]
      : [new PasswordMinLengthRule(), new PasswordMaxLengthRule()];

    this.requestPasswordResetMessenger = args.requestPasswordResetMessenger;
    this.resetPasswordMessenger = args.resetPasswordMessenger;

    this.resetTokenExpireMs = args.resetTokenExpireMs ?? 300000; // defaults to 5 min
  }

  private readonly store: ActorRef;

  private requestPasswordResetMessenger?: ActorRef | null;

  private resetPasswordMessenger?: ActorRef | null;

  private readonly verify: VerifyingMethod;

  private readonly hash: HashingMethod;

  private readonly passwordRules: PasswordRule[];

  private readonly resetTokenExpireMs: number;

  async verifyUserCreation(@Receive message: VerifyUserCreation) {
    const { auth } = message;
    const { password } = auth;

    if (typeof password !== 'string') {
      throw new InvalidPasswordError();
    }

    for (const passwordRule of this.passwordRules) {
      if (!(await passwordRule.validate(password))) {
        throw new InvalidPasswordError(passwordRule.description());
      }
    }
  }

  async createPassword(@Receive message: CreateUser) {
    const { traceId, id, auth } = message;

    const { password, passwordHash } = auth;

    const newPasswordHash = password
      ? await this.hash(password as string)
      : (passwordHash as string);

    if (!newPasswordHash) {
      throw new InvalidPasswordHashError();
    }

    const { error, reason, response } = await this.store.ask(
      new CreateRecord<Password>({
        traceId,
        reason: message,
        record: {
          id: id || undefined,
          passwordHash: newPasswordHash,
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

  async deleteUser(@Receive message: DeleteUser) {
    const { traceId, id } = message;

    const { error, response } = await this.store.ask(
      new DeleteRecord<Password>({
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
  }

  async signin(@Receive message: SignInUser) {
    const { traceId, auth } = message;
    const id = Number(message.id ?? '0');
    const { password } = auth;

    const {
      error,
      reason: getRecord,
      response,
    } = await this.store.ask(
      new GetRecord<Password>({
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

    if (!getRecord.record) {
      throw new MissingPasswordError();
    }

    const isVerifiedPassword = await this.verify(
      getRecord.record.passwordHash,
      password as string,
    );

    if (!isVerifiedPassword) {
      throw new WrongPasswordError();
    }

    message.id = id;
  }

  async changePassword(@Receive message: ChangePassword) {
    const { password, id } = message;

    const { error, response } = await this.store.ask(
      new UpdateRecord<Password>({
        record: {
          id,
          passwordHash: await this.hash(password),
        },
        sender: this.constructor.name,
      }),
    );

    this.emitToListeners(response);

    if (error) {
      throw error;
    }
  }

  async resetPassword(@Receive message: ResetPassword) {
    const { password, traceId, id, resetToken } = message;

    const { error, reason: getRecord } = await this.store.ask(
      new GetRecord<Password>({
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

    if (!getRecord.record) {
      throw new MissingPasswordError();
    }

    if (getRecord.record?.resetToken !== resetToken) {
      throw new WrongResetTokenError();
    }

    if (
      !getRecord.record?.resetTokenExpiresAt ||
      getRecord.record.resetTokenExpiresAt.toMillis() <=
        DateTime.utc().toMillis()
    ) {
      throw new WrongResetTokenError();
    }

    const { error: updateError, response } = await this.store.ask(
      new UpdateRecord<Password>({
        record: {
          id,
          passwordHash: await this.hash(password),
          resetToken: null,
          resetTokenExpiresAt: null,
        },
        sender: this.constructor.name,
      }),
    );

    if (updateError) {
      throw updateError;
    }

    const messenger = this.resolveActor(
      PASSWORD_RESET_MESSENGER,
      'resetPasswordMessenger' as any,
    );

    if (messenger) {
      await this.sendToMessenger({
        id,
        message,
        messenger,
        payload: {},
      });
    }

    this.emitToListeners(response);
  }

  async requestPasswordReset(@Receive message: RequestPasswordReset) {
    const { traceId, id } = message;

    const {
      error,
      reason: getRecord,
      response,
    } = await this.store.ask(
      new GetRecord<Password>({
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

    if (!getRecord.record) {
      throw new MissingPasswordError();
    }

    message.resetToken = randomUUID();

    const { error: updateError } = await this.store.ask(
      new UpdateRecord<Password>({
        record: {
          id,
          resetToken: message.resetToken,
          resetTokenExpiresAt: DateTime.utc()
            .plus({ millisecond: this.resetTokenExpireMs })
            .toISO({ suppressMilliseconds: true }),
        },
        sender: this.constructor.name,
      }),
    );

    if (updateError) {
      throw updateError;
    }

    const messenger = this.resolveActor(
      PASSWORD_RESET_REQUEST_MESSENGER,
      'requestPasswordResetMessenger' as any,
    );

    if (messenger) {
      await this.sendToMessenger({
        id,
        message,
        messenger,
        payload: {
          resetToken: message.resetToken,
        },
      });
    }
  }

  private async sendToMessenger({
    id,
    messenger,
    payload,
    message,
  }: {
    id: number;
    messenger: ActorRef;
    payload: Record<string, any>;
    message: Message;
  }) {
    const { error } = await messenger.ask(
      new SendMessage({
        from: { id },
        to: [{ id }],
        payload,
        reason: message,
        traceId: message.traceId,
        sender: this.constructor.name,
      }),
    );

    if (error) {
      throw error;
    }
  }

  private resolveActor(
    address: string,
    actorRef: keyof PasswordActor,
  ): ActorRef | null {
    if (this[actorRef]) {
      return this[actorRef] as unknown as ActorRef;
    } else {
      const ref = ActorSystem.resolve(address);
      (this as any)[actorRef] = ref;
      return ref;
    }
  }
}
