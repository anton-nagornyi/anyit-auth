import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type CreateUserArgs = Omit<MessageArgs<CreateUser>, 'id'> & {
  id?: number;
};

@RegisterMessage('01HEHJ5M8H2PKG4JT8WZF5ZXTF')
export class CreateUser extends Message {
  constructor(args: CreateUserArgs) {
    super(args);
    this.auth = { ...args.auth };
    this.profile = { ...args.profile };
    this.id = args.id ?? 0;
    this.ipAddress = args.ipAddress;
  }

  readonly profile: Record<
    string,
    string | number | boolean | string[] | number[] | boolean[]
  >;

  readonly auth: { type: string | string[] } & Record<
    string,
    string | number | boolean | string[] | number[] | boolean[]
  >;

  id: number;

  readonly ipAddress?: string;
}

export const isCreateUser = (message?: Message): message is CreateUser =>
  Boolean(message && message.code === CreateUser.code);
