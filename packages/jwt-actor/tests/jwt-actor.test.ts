import '@anyit/be-dev';
import { ActorRef, ActorSystem } from '@anyit/actor';
import { CreateToken, VerifyToken } from '@anyit/token-dto';
import { ErrorMessage, SuccessMessage } from '@anyit/messaging';
import { JwtActor } from '../src/jwt-actor';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');

describe('Given JwtActor for Token Operations', () => {
  let jwtActor: ActorRef;
  const secret = 'test_secret';
  const token = 'token';

  beforeEach(() => {
    jwtActor = ActorSystem.create(JwtActor, { secret });
    jwt.sign = jest.fn().mockReturnValueOnce(token);
  });

  describe('When creating a token', () => {
    const jwtError = new Error('some error');

    beforeEach(() => {
      jwt.sign.mockReturnValueOnce(token);
    });

    it('Then it should return a SuccessMessage with a token', async () => {
      const createTokenMessage = new CreateToken({
        payload: { userId: 1 },
        expiresIn: '1h',
      });

      const { reason, response } = await jwtActor.ask(createTokenMessage);

      expect(response).toBeInstanceOf(SuccessMessage);
      expect(reason).toHaveProperty('token');
      expect(reason.token).toBe(token);
    });

    it('Then it should return an ErrorMessage on failure', async () => {
      jwt.sign = jest.fn().mockImplementationOnce(() => {
        throw jwtError;
      });

      const createTokenMessage = new CreateToken({
        payload: { userId: 1 },
        expiresIn: -11,
      });

      const { error, response } = await jwtActor.ask(createTokenMessage);

      expect(response).toBeInstanceOf(ErrorMessage);
      expect(error).toBe(jwtError);
    });
  });

  describe('When verifying a token', () => {
    const verificationResult = { claim: 'ok' };
    const tokenError = new Error('some error');

    it('Then it should return a SuccessMessage with payload and claims if token is valid', async () => {
      jwt.verify = jest.fn().mockReturnValueOnce(verificationResult);

      const verifyTokenMessage = new VerifyToken({
        token: 'token',
      });

      const { reason, response } = await jwtActor.ask(verifyTokenMessage);

      expect(response).toBeInstanceOf(SuccessMessage);
      expect(reason.payloadAndClaims).toBe(verificationResult);
    });

    it('Then it should return an ErrorMessage if token is invalid or expired', async () => {
      jwt.verify = jest.fn().mockImplementationOnce(() => {
        throw tokenError;
      });

      const verifyTokenMessage = new VerifyToken({
        token: 'invalidToken',
      });

      const { error, response } = await jwtActor.ask(verifyTokenMessage);

      expect(response).toBeInstanceOf(ErrorMessage);
      expect(error).toBe(tokenError);
    });
  });
});
