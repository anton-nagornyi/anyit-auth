import { Message, RegisterMessage } from '@anyit/messaging';
import { CreateUser } from './create-user';

@RegisterMessage('01HEYFK3XFYRR928QEQBMKRR3Z')
export class VerifyUserCreation extends CreateUser {}

export const isVerifyUserCreation = (
  message?: Message,
): message is VerifyUserCreation =>
  Boolean(message && message.code === VerifyUserCreation.code);
