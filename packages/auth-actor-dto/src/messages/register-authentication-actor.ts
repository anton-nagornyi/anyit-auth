import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';
import { AuthDataField } from '../auth-data-field';

export type RegisterAuthActorArgs = MessageArgs<RegisterAuthenticationActor>;

@RegisterMessage('01HEHHG9JZSGTM8Q9JPGMJDS9C')
export class RegisterAuthenticationActor extends Message {
  constructor(args: RegisterAuthActorArgs) {
    super(args);
    this.address = args.address;
    this.authType = args.authType;
    this.dataFields = [...args.dataFields];
  }

  readonly authType: string;

  readonly address: string;

  readonly dataFields: AuthDataField[];
}

export const isRegisterAuthActor = (
  message?: Message,
): message is RegisterAuthenticationActor =>
  Boolean(message && message.code === RegisterAuthenticationActor.code);
