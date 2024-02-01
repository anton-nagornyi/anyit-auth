import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';
import { PasswordAuth } from './password-auth';

export type ResetPasswordArgs = MessageArgs<ResetPassword>;

@RegisterMessage('01HBWP9N2D6GN3D0ES9FVD56VW')
export class ResetPassword extends PasswordAuth {
  constructor(args: ResetPasswordArgs) {
    super(args);
    this.resetToken = args.resetToken;
  }

  readonly resetToken: string;
}

export const isResetPassword = (message?: Message): message is ResetPassword =>
  Boolean(message && message.code === ResetPassword.code);
