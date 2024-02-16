import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type RevokeRefreshArgs = MessageArgs<RevokeRefresh>;

@RegisterMessage('01HESA73QKG1BRYDDSHVY8S7X7')
export class RevokeRefresh extends Message {
  constructor(args: RevokeRefreshArgs) {
    super(args);
    this.id = args.id;
    this.tokenId = args.tokenId;
  }

  readonly id: number;

  readonly tokenId?: number;
}

export const isRevokeRefresh = (message?: Message): message is RevokeRefresh =>
  Boolean(message && message.code === RevokeRefresh.code);
