import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

export type CreateRefreshTokenArgs = Omit<
  MessageArgs<CreateRefreshToken>,
  'refreshToken' | 'tokenId'
> & { refreshToken?: string; tokenId?: number };

@RegisterMessage('01HEPYY1AWJKBMT78Q16HFKJ8J')
export class CreateRefreshToken extends Message {
  constructor(args: CreateRefreshTokenArgs) {
    super(args);

    this.refreshToken = args.refreshToken ?? '';
    this.tokenId = args.tokenId ?? 0;
  }

  refreshToken: string;

  tokenId: number;
}

export const isCreateRefreshToken = (
  message?: Message,
): message is CreateRefreshToken =>
  Boolean(message && message.code === CreateRefreshToken.code);
