import { RegisterMessage, Message } from '@anyit/messaging';

@RegisterMessage('01HP1FXZNTQ34TF0C91F3YB3PP')
export class UnlockIdentitiesPeriodically extends Message {}

export const isUnlockIdentitiesPeriodically = (
  message?: Message,
): message is UnlockIdentitiesPeriodically =>
  Boolean(message && message.code === UnlockIdentitiesPeriodically.code);
