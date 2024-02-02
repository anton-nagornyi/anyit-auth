import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type UpdateRecordArgs<T> = MessageArgs<UpdateRecord<T>>;

@RegisterMessage('01HEMDDP102H5JM269ENA7R3M8')
export class UpdateRecord<T = Record<string, any>> extends Message {
  constructor(args: UpdateRecordArgs<T>) {
    super(args);
    this.record = { ...(args.record as T) };
  }

  readonly record: Partial<T>;
}

export const isUpdateRecord = (message?: Message): message is UpdateRecord =>
  Boolean(message && message.code === UpdateRecord.code);
