import { RegisterMessage, Message } from '@anyit/messaging';

@RegisterMessage('01HEYE64BW9E2B9F8WG5N9T91K')
export class GetNextIdIncremented extends Message {
  nextId = 0;
}

export const isGetNextIdIncremented = (
  message?: Message,
): message is GetNextIdIncremented =>
  Boolean(message && message.code === GetNextIdIncremented.code);
