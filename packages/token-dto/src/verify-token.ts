import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type VerifyTokenArgs = Omit<
  MessageArgs<VerifyToken>,
  'payloadAndClaims'
>;

@RegisterMessage('01HCEJBT2KTW2ZT02VCER3G396')
export class VerifyToken extends Message {
  constructor(args: VerifyTokenArgs) {
    super(args);

    this.token = args.token;
  }

  readonly token: string;

  payloadAndClaims: Record<string, any> = {};
}

export const isVerifyToken = (message?: Message): message is VerifyToken =>
  Boolean(message && message.code === VerifyToken.code);
