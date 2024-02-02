import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type DeleteRecordArgs<T> = MessageArgs<DeleteRecord<T>>;

@RegisterMessage('01HEMDHQ9B2S29MG746HJBWMRY')
export class DeleteRecord<T = Record<string, any>> extends Message {
  constructor(args: DeleteRecordArgs<T>) {
    super(args);
    this.filter = { ...(args.filter as T) };
  }

  readonly filter: Partial<T>;
}

export const isDeleteRecord = (message?: Message): message is DeleteRecord =>
  Boolean(message && message.code === DeleteRecord.code);
