# @anyit/username-actor Library

This library introduces the `UsernameActor` class, designed to manage username operations within the AnyIT platform. 
It leverages the `@anyit/actor`, `@anyit/message-handling`, and `@anyit/username-dto` libraries to provide a 
comprehensive solution for username validation, creation, and management.

## Key Features

- **Username Management**: Supports verifying, creating, signing in, and deleting usernames.
- **Custom Validation**: Allows for custom username verification logic.
- **Integration with Store**: Utilizes a store actor for persistent storage of username records.

## Installation

This package is intended for internal use within the AnyIT platform. For external installation, if available:

```shell
yarn add @anyit/username-actor
```

## Usage

### Initializing the UsernameActor

Create a `UsernameActor` instance by providing it with a store actor reference and optionally a custom verification method:

```typescript
import { UsernameActor } from '@anyit/username-actor';
import { ActorSystem } from '@anyit/actor';

const usernameActor = ActorSystem.create(UsernameActor, {
  store: storeActorRef,
  verify: (username) => {
    // Custom verification logic
    return true;
  }
});
```

### Supported Operations

- **VerifyUserCreation**: Validates a username during the user creation process.
- **CreateUser**: Registers a new username in the system.
- **SignInUser**: Verifies a username during the sign-in process.
- **DeleteUser**: Removes a username from the system.

### Error Handling

Implements `MissingUsernameError` and `WrongUsernameError` for comprehensive error feedback related to username operations.

## Contributing

Contributions to the `@anyit/username-actor` library are encouraged, particularly in areas such as expanding the username 
verification logic, enhancing error handling, and improving integration with other system components.

## License

This project is licensed under the MIT License.

