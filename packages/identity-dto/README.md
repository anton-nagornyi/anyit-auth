# @anyit/identity-dto Library

This library provides the data transfer objects (DTOs) and utilities for managing identities within the AnyIT ecosystem, 
ensuring seamless integration with `@anyit/auth-actor-dto` for authentication and authorization processes.

## Key Features

- **IDENTITY_ACTOR** and **IDENTITY_STORE_ACTOR**: Constants identifying the actors responsible for identity operations and storage.
- **Identity Interface**: Specifies the structure for identity records, including timestamps for creation, login, and activity, as well as status flags for activity and lockouts.
- **Error Handling**: Defines the `WrongArgumentValue` error class for handling exceptions related to invalid argument values.
- **Message Classes**: Includes message classes such as `LockIdentity`, `SeeIdentity`, `SetActiveIdentity`, and `UnlockIdentity` for performing operations on identity records.

## Installation

This package is intended for internal use within the AnyIT platform. For external installation, if available:

```shell
yarn add @anyit/identity-dto
```

Ensure your project is configured to access the necessary npm registry.

## Usage

### Identity Management

The `Identity` interface and related message classes facilitate identity management tasks:

```typescript
import { Identity, LockIdentity, SeeIdentity, SetActiveIdentity, UnlockIdentity } from '@anyit/identity-dto';
```

### Constants

Use the `IDENTITY_ACTOR` and `IDENTITY_STORE_ACTOR` for actor lookups within the actor system:

```typescript
import { IDENTITY_ACTOR, IDENTITY_STORE_ACTOR } from '@anyit/identity-dto';
```

### Error Handling

Utilize the `WrongArgumentValue` class for managing errors related to incorrect argument values:

```typescript
throw new WrongArgumentValue('argumentName');
```

### Operations

- **LockIdentity**: Locks an identity record for a specified duration.
- **SeeIdentity**: Updates the `lastSeenAt` timestamp and IP address for an identity.
- **SetActiveIdentity**: Sets the active status of an identity record.
- **UnlockIdentity**: Unlocks a previously locked identity record.

## Contributing

Contributions are encouraged to enhance the library's functionality, improve error handling, and expand integration
with other services within the AnyIT ecosystem.

## License

This project is licensed under the MIT License.

