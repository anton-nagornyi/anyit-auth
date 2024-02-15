import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type GetProfileArgs<T> = Omit<MessageArgs<GetProfile<T>>, 'profile'>;

@RegisterMessage('01HFHDJKPE23HTVHWB6EN4WX52')
export class GetProfile<T = Record<string, any>> extends Message {
  constructor(args: GetProfileArgs<T>) {
    super(args);
    this.id = args.id;
  }

  readonly id: number;

  profile: T | null = null;
}

export const isGetProfile = (message?: Message): message is GetProfile =>
  Boolean(message && message.code === GetProfile.code);
