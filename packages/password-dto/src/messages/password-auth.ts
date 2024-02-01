import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type PasswordAuthArgs = MessageArgs<PasswordAuth>;

@RegisterMessage('01HBV2B6WM4YPXWFES6CS3646M')
export class PasswordAuth extends Message {
  constructor(args: PasswordAuthArgs) {
    super(args);
    this.password = args.password;
    this.id = args.id;
  }

  readonly id: number;

  readonly password: string;

  toJSON() {
    return {
      ...super.toJSON(),
      password: '*****',
    };
  }
}

export const isPasswordAuth = (message?: Message): message is PasswordAuth =>
  Boolean(message && message.code === PasswordAuth.code);
