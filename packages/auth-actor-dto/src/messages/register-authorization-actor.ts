import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';
import { AuthDataField } from '../auth-data-field';

export type RegisterAuthorizationActorArgs =
  MessageArgs<RegisterAuthorizationActor>;

@RegisterMessage('01HEPQETM963PTD45110AWBA6B')
export class RegisterAuthorizationActor extends Message {
  constructor(args: RegisterAuthorizationActorArgs) {
    super(args);
    this.address = args.address;
    this.dataFields = [...args.dataFields];
  }

  readonly address: string;

  readonly dataFields: AuthDataField[];
}

export const isRegisterAuthorizationActor = (
  message?: Message,
): message is RegisterAuthorizationActor =>
  Boolean(message && message.code === RegisterAuthorizationActor.code);
