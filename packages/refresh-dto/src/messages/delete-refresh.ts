import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type DeleteRefreshArgs = MessageArgs<DeleteRefresh>;

@RegisterMessage('01HES9YA2CE3XN1MXPRMGC69H7')
export class DeleteRefresh extends Message {
  constructor(args: DeleteRefreshArgs) {
    super(args);
    this.id = args.id;
  }

  readonly id: number;
}

export const isDeleteRefresh = (message?: Message): message is DeleteRefresh =>
  Boolean(message && message.code === DeleteRefresh.code);
