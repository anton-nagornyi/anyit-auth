import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type DeleteUserArgs = MessageArgs<DeleteUser>;

@RegisterMessage('01HEHSBQH01PY4GSKTDVTGG1X3')
export class DeleteUser extends Message {
  constructor(args: DeleteUserArgs) {
    super(args);
    this.id = args.id;
  }

  readonly id: number;
}

export const isDeleteUser = (message?: Message): message is DeleteUser =>
  Boolean(message && message.code === DeleteUser.code);
