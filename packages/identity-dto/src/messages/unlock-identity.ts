import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type UnlockIdentityArgs = MessageArgs<UnlockIdentity>;

@RegisterMessage('01HC46AQAEM02WVZJQXR2C0B50')
export class UnlockIdentity extends Message {
  constructor(args: UnlockIdentityArgs) {
    super(args);
    this.id = args.id;
  }

  readonly id: number;
}

export const isUnlockIdentity = (
  message?: Message,
): message is UnlockIdentity =>
  Boolean(message && message.code === UnlockIdentity.code);
