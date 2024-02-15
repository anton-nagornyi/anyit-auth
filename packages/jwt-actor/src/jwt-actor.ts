import { Actor, ActorArgs } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import { SuccessMessage, ErrorMessage } from '@anyit/messaging';
import { CreateToken, VerifyToken } from '@anyit/token-dto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

export type JwtActorArgs = ActorArgs & {
  secret: string;
};

export class JwtActor extends Actor {
  constructor(args: JwtActorArgs) {
    super(args);

    this.secret = args.secret;
  }

  private readonly secret: string;

  async createToken(@Receive message: CreateToken) {
    const { payload, expiresIn, claims } = message;

    message.token = sign(payload, this.secret, { expiresIn, ...claims });
  }

  async verifyToken(@Receive message: VerifyToken) {
    const { token } = message;
    message.payloadAndClaims = verify(token, this.secret) as JwtPayload;
  }
}
