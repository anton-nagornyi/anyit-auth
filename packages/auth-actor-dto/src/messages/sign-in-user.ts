import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type SignInUserArgs = Omit<
  MessageArgs<SignInUser>,
  'id' | 'accessToken'
> & {
  id?: number;
  accessToken?: string;
};

@RegisterMessage('01HEHRM68PPA5JS71EG0G437GG')
export class SignInUser extends Message {
  constructor(args: SignInUserArgs) {
    super(args);
    this.auth = { ...args.auth };
    this.id = args.id ?? 0;
    this.accessToken = args.accessToken ?? '';
    this.refreshTokenId = args.refreshTokenId;
    this.ipAddress = args.ipAddress;
  }

  readonly auth: { type: string | string[] } & Record<
    string,
    string | number | boolean | string[] | number[] | boolean[]
  >;

  id: number;

  accessToken: string;

  readonly refreshTokenId: number;

  readonly ipAddress?: string;
}

export const isSignInUser = (message?: Message): message is SignInUser =>
  Boolean(message && message.code === SignInUser.code);
