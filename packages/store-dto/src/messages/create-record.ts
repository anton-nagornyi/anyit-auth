import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type CreateRecordArgs<T> = Omit<MessageArgs<CreateRecord<T>>, 'id'> & {
  id?: number;
};

@RegisterMessage('01HEMD4GNN6KD26978VNBNVV77')
export class CreateRecord<T = Record<string, any>> extends Message {
  constructor(args: CreateRecordArgs<T>) {
    super(args);
    this.record = { ...(args.record as T) };
    this.id = args.id ?? 0;
  }

  id: number;

  readonly record: Partial<T>;
}

export const isCreateRecord = (message?: Message): message is CreateRecord =>
  Boolean(message && message.code === CreateRecord.code);
