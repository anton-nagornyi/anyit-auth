import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type LockIdentityArgs = Omit<
  MessageArgs<LockIdentity>,
  'lockForSeconds'
> & { lockForSeconds?: number };

@RegisterMessage('01HC42XTSAR8SESF2MZ4QKTR0Q')
export class LockIdentity extends Message {
  constructor(args: LockIdentityArgs) {
    super(args);
    this.id = args.id;
    this.lockForSeconds = args.lockForSeconds ?? 0;
  }

  readonly id: number;

  readonly lockForSeconds: number;
}

export const isLockIdentity = (message?: Message): message is LockIdentity =>
  Boolean(message && message.code === LockIdentity.code);
