import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type AuthorizeUserArgs = Omit<
  MessageArgs<AuthorizeUser>,
  'permissions'
> & { permissions?: Record<string, any> };

@RegisterMessage('01HEPRKZQMY1V694NG7YG94J3Q')
export class AuthorizeUser extends Message {
  constructor(args: AuthorizeUserArgs) {
    super(args);
    this.id = args.id;
    this.permissions = { ...args.permissions };
  }

  readonly id: number;

  permissions: Record<string, any>;
}

export const isAuthorizeUser = (message?: Message): message is AuthorizeUser =>
  Boolean(message && message.code === AuthorizeUser.code);
