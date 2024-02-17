import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type RegisterProfileActorArgs = MessageArgs<RegisterProfileActor>;

@RegisterMessage('01HFGTJ3ET34SP4VN5SPYQFBG1')
export class RegisterProfileActor extends Message {
  constructor(args: RegisterProfileActorArgs) {
    super(args);
    this.address = args.address;
  }

  readonly address: string;
}

export const isRegisterProfileActor = (
  message?: Message,
): message is RegisterProfileActor =>
  Boolean(message && message.code === RegisterProfileActor.code);
