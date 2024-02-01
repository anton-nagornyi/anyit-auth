import { Message, RegisterMessage, MessageArgs } from '@anyit/messaging';

export type DeletePasswordArgs = MessageArgs<DeletePassword>;

@RegisterMessage('01HEHW5ZYS4VFY2F5BBW8FN5NV')
export class DeletePassword extends Message {
  constructor(args: DeletePasswordArgs) {
    super(args);
    this.id = args.id;
  }

  readonly id: number;
}

export const isDeletePassword = (
  message?: Message,
): message is DeletePassword =>
  Boolean(message && message.code === DeletePassword.code);
