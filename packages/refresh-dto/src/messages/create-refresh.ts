import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type CreateRefreshArgs = Omit<MessageArgs<CreateRefresh>, 'tokenId'> & {
  tokenId?: number;
};

@RegisterMessage('01HDQTP8AFFRZH03PG7MEKWTFN')
export class CreateRefresh extends Message {
  constructor(args: CreateRefreshArgs) {
    super(args);
    this.tokenId = args.tokenId ?? 0;
    this.id = args.id;
    this.accessClaims = args.accessClaims;
  }

  readonly id: number;

  readonly accessClaims: Record<string, any>;

  tokenId: number;
}

export const isCreateRefresh = (message?: Message): message is CreateRefresh =>
  Boolean(message && message.code === CreateRefresh.code);
