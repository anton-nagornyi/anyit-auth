import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type GetRecordsArgs<T> = Omit<MessageArgs<GetRecords<T>>, 'records'>;

@RegisterMessage('01HES92DSGMMTZR75JDS7Y2546')
export class GetRecords<T = Record<string, any>> extends Message {
  constructor(args: GetRecordsArgs<T>) {
    super(args);
    this.filter = { ...(args.filter as T) };
  }

  records: T[] = [];

  readonly filter: Partial<T>;
}

export const isGetRecords = (message?: Message): message is GetRecords =>
  Boolean(message && message.code === GetRecords.code);
