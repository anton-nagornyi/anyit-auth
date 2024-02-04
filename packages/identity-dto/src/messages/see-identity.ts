import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type SeeIdentityArgs = MessageArgs<SeeIdentity>;

@RegisterMessage('01HC43C5GK0QZQCENFYTNF42PE')
export class SeeIdentity extends Message {
  constructor(args: SeeIdentityArgs) {
    super(args);
    this.identityId = args.identityId;
    this.ipAddress = args.ipAddress;
  }

  readonly identityId: number;

  readonly ipAddress: string;
}

export const isSeeIdentity = (message?: Message): message is SeeIdentity =>
  Boolean(message && message.code === SeeIdentity.code);
