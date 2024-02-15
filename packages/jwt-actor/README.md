# @anyit/jwt-actor Library

The `@anyit/jwt-actor` library provides a robust implementation for JSON Web Token (JWT) operations within the 
AnyIT platform, leveraging the `@anyit/actor` and `@anyit/message-handling` systems. It utilizes the `@anyit/token-dto`
library for token data transfer objects, facilitating seamless creation and verification of JWTs.

## Key Features

- **JWT Creation and Verification**: Implements operations for generating and validating JWTs, including handling custom claims and setting expiration.
- **Secret Management**: Utilizes a secret key for signing and verifying tokens, ensuring security and integrity.
- **Integration with Messaging**: Leverages the messaging infrastructure for processing token-related operations.

## Installation

To install the library:

```shell
yarn add @anyit/jwt-actor
```

Ensure your project has access to the necessary npm registry.

## Usage

### Initializing JwtActor

Instantiate a `JwtActor` with a secret key for signing and verifying JWTs:

```typescript
import { JwtActor } from '@anyit/jwt-actor';
import { ActorSystem } from '@anyit/actor';

const jwtActor = ActorSystem.create(JwtActor, {
  secret: 'your-secret-key'
});
```

### Operations

- **CreateToken**: Generates a JWT based on the provided payload, expiration, and additional claims.
- **VerifyToken**: Validates a given JWT and extracts its payload and claims.

### Examples

#### Creating a JWT

To create a JWT with specific claims and expiration:

```typescript

const {reason} = await jwtActor.ask(new CreateToken({
  payload: { userId: 1 },
  expiresIn: '1h',
  claims: { role: 'user' }
}));

console.log(reason.token);
```

#### Verifying a JWT

To verify a JWT and retrieve its payload and claims:

```typescript
const {reason} = jwtActor.ask(new VerifyToken({
  token: 'your.jwt.token.here'
}));

console.log(reson.payloadAndClaims);
```

## License

This project is licensed under the MIT License.
