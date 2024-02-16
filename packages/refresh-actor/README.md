# @anyit/refresh-actor Library

The `@anyit/refresh-actor` library orchestrates the management of refresh tokens within the AnyIT platform. 
It utilizes the `@anyit/actor` framework for actor-based communication, `@anyit/message-handling` for handling messages,
and integrates with `@anyit/refresh-dto` for refresh token data transfer objects. This library is designed to handle 
operations such as creating, verifying, deleting, and revoking refresh tokens.

## Key Features

- **Refresh Token Operations**: Facilitates creating, verifying, deleting, and revoking refresh tokens, as well as managing token IDs.
- **Token Limit Enforcement**: Supports limiting the number of refresh tokens per identity.
- **Error Management**: Implements custom errors like `MaxRefreshTokensLimitError` and `MissingRefreshTokenError` to handle specific refresh token operation failures.

## Installation

To install the library:

```shell
yarn add @anyit/refresh-actor
```

Make sure your project is configured to access the appropriate npm registry.

## Usage

### Initializing the RefreshActor

Instantiate a `RefreshActor` with a reference to the store actor and optionally specify a maximum tokens limit:

```typescript
import { RefreshActor } from '@anyit/refresh-actor';
import { ActorSystem } from '@anyit/actor';

const refreshActor = ActorSystem.create(RefreshActor, {
  store: storeActorRef,
  maxTokensLimit: 5 // Optional maximum limit of refresh tokens per identity
});
```

### Operations

- **CreateRefresh**: Generates a new refresh token, adhering to the specified tokens limit per identity.
- **VerifyRefresh**: Validates a refresh token, retrieving its associated identity and access claims.
- **DeleteRefresh**: Removes a refresh token based on its identity ID.
- **RevokeRefresh**: Specifically revokes a refresh token by its token and identity ID.
- **GetTokenId**: Retrieves the next incremental token ID.

### Managing Refresh Tokens

To create a refresh token for a specific identity with custom access claims:

```typescript
const { reason } = await refreshActor.ask(new CreateRefresh({
  id: identityId,
  accessClaims: { role: 'user' }
}));

console.log(reason.tokenId);
```

To verify the validity of a refresh token and extract its details:

```typescript
const { reason } = await refreshActor.ask(new VerifyRefresh({
  tokenId: 1
}));

console.log(reason.identityId);
```

## License

This project is licensed under the MIT License.

## Author
