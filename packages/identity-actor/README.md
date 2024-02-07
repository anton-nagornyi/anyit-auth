# @anyit/identity-actor Library

This library introduces the `IdentityActor` class for managing identity operations within the AnyIT platform. It is 
integrated with `@anyit/actor` for actor-based messaging, `@anyit/message-handling` for message processing, and 
uses `@anyit/identity-dto` for data transfer objects related to identity management.

## Key Features

- **Comprehensive Identity Management**: Facilitates creating, verifying, locking/unlocking, and updating identity records.
- **Custom Error Handling**: Implements specific errors like `IdentityInactiveError`, `IdentityLockedError`, `WrongArgumentValueError`, `MissingIdentityError` for nuanced feedback.
- **Integration with Store Actor**: Leverages a store actor reference for persistent operations on identity records.
- **Advanced Query Support**: Employs operators from `@anyit/store-dto` for sophisticated data retrieval and updates.

## Installation

To install the library:

```shell
yarn add @anyit/identity-actor
```

Ensure your project has access to the necessary npm registry.

## Usage

### Initializing IdentityActor

Instantiate an `IdentityActor` with a reference to the store actor:

```typescript
import { IdentityActor } from '@anyit/identity-actor';
import { ActorSystem } from '@anyit/actor';

const identityActor = ActorSystem.create(IdentityActor, {
  store: storeActorRef
});
```

### Operations

- **VerifyUserCreation**: Checks identity fields during the user creation process.
- **CreateIdentity**: Registers a new identity in the system.
- **SignInUser**: Verifies an identity during the sign-in process, checking for active and lock status.
- **SeeIdentity**: Updates the last seen information for an identity.
- **LockIdentity**: Locks an identity for a specified duration or indefinitely.
- **UnlockIdentity**: Unlocks a locked identity.
- **SetActiveIdentity**: Modifies the active status of an identity.
- **UnlockIdentitiesPeriodically**: Scheduled task to unlock identities that have passed their lock duration.

### Example: Updating Identity Last Seen

To update an identity's last seen timestamp and IP address:

```typescript
identityActor.tell(new SeeIdentity({
  identityId: 1,
  ipAddress: '192.168.1.1'
}));
```

### Example: Unlocking an Identity

To manually unlock a locked identity:

```typescript
identityActor.tell(new UnlockIdentity({
  id: 1
}));
```

## Contributing

Contributions are welcome to enhance the library's functionality, particularly in the areas of identity verification 
logic, error handling, and integration with other system components.

## License

This project is licensed under the MIT License.
