import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type VerifyRefreshArgs = Omit<
  MessageArgs<VerifyRefresh>,
  'accessClaims' | 'identityId'
>;

@RegisterMessage('01HEQ066HA20Q9ZZ9445ZX1FCQ')
export class VerifyRefresh extends Message {
  constructor(args: VerifyRefreshArgs) {
    super(args);
    this.tokenId = args.tokenId;
  }

  readonly tokenId: number;

  accessClaims: Record<string, any> = {};

  identityId = 0;
}

export const isVerifyRefresh = (message?: Message): message is VerifyRefresh =>
  Boolean(message && message.code === VerifyRefresh.code);
