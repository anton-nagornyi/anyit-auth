import { RegisterMessage, Message } from '@anyit/messaging';

@RegisterMessage('01HESC1G3DHFTCWSR7M1HDNEKV')
export class GetTokenId extends Message {
  tokenId = 0;
}

export const isGetTokenId = (message?: Message): message is GetTokenId =>
  Boolean(message && message.code === GetTokenId.code);
