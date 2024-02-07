import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

export type RefreshAccessTokenArgs = Omit<
  MessageArgs<RefreshAccessToken>,
  'accessToken'
> & { accessToken?: string };

@RegisterMessage('01HEPZH07SRJKXD2MY6FRRCP4M')
export class RefreshAccessToken extends Message {
  constructor(args: RefreshAccessTokenArgs) {
    super(args);

    this.refreshToken = args.refreshToken;
    this.accessToken = args.accessToken ?? '';
    this.ipAddress = args.ipAddress;
    this.id = args.id;
  }

  refreshToken: string;

  accessToken: string;

  id = 0;

  readonly ipAddress?: string;
}

export const isRefreshAccessToken = (
  message?: Message,
): message is RefreshAccessToken =>
  Boolean(message && message.code === RefreshAccessToken.code);
