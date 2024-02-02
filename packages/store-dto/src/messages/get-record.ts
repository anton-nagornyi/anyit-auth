import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type GetRecordArgs<T> = Omit<MessageArgs<GetRecord<T>>, 'record'>;

@RegisterMessage('01HEMDF9ZE70C13ZJX2HM6D3WA')
export class GetRecord<T = Record<string, any>> extends Message {
  constructor(args: GetRecordArgs<T>) {
    super(args);
    this.filter = { ...(args.filter as T) };
  }

  record: T | null = null;

  readonly filter: Partial<T>;
}

export const isGetRecord = (message?: Message): message is GetRecord =>
  Boolean(message && message.code === GetRecord.code);
