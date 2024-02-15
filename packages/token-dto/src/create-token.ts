import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type CreateTokenArgs = Omit<
  MessageArgs<CreateToken>,
  'token' | 'claims'
> & { claims?: Record<string, string | number> };

@RegisterMessage('01HCEFKZDSTDJAMA6JP8S7D8RX')
export class CreateToken extends Message {
  constructor(args: CreateTokenArgs) {
    super(args);

    this.payload = args.payload;

    this.expiresIn = args.expiresIn;

    this.claims = { ...args.claims };
  }

  readonly payload: Record<any, any>;

  readonly expiresIn: string | number;

  readonly claims: Record<string, string | number>;

  token = '';
}

export const isCreateToken = (message?: Message): message is CreateToken =>
  Boolean(message && message.code === CreateToken.code);
