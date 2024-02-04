import { RegisterMessage, Message, MessageArgs } from '@anyit/messaging';

export type SetActiveIdentityArgs = MessageArgs<SetActiveIdentity>;

@RegisterMessage('01HC445CMX1E7XJH6KQ7TND8RM')
export class SetActiveIdentity extends Message {
  constructor(args: SetActiveIdentityArgs) {
    super(args);
    this.id = args.id;
    this.isActive = args.isActive;
  }

  readonly id: number;

  readonly isActive: boolean;
}

export const isSetActiveIdentity = (
  message?: Message,
): message is SetActiveIdentity =>
  Boolean(message && message.code === SetActiveIdentity.code);
