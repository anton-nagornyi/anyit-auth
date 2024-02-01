import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type RequestPasswordResetArgs = Omit<
  MessageArgs<RequestPasswordReset>,
  'resetToken'
> & { resetToken?: string };

@RegisterMessage('01HBWRJT57T9PDNPT1FXFCJ1H1')
export class RequestPasswordReset extends Message {
  constructor(args: RequestPasswordResetArgs) {
    super(args);
    this.resetToken = args.resetToken;
    this.id = args.id;
  }

  readonly id: number;

  resetToken?: string;
}

export const isRequestPasswordReset = (
  message?: Message,
): message is RequestPasswordReset =>
  Boolean(message && message.code === RequestPasswordReset.code);
