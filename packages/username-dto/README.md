# @anyit/username-dto Library

This library provides structures and constants for managing usernames within the AnyIT ecosystem, seamlessly 
integrating with the `@anyit/auth-actor-dto` for comprehensive authentication and authorization workflows.

## Key Features

- **USERNAME_ACTOR** and **USERNAME_STORE_ACTOR**: Unique identifiers for the actors responsible for username operations and storage within the system.
- **SharedFields**: A predefined array of `AuthDataField` objects that represent common fields used across the authentication and authorization modules.
- **Username Interface**: Defines the essential properties of a username entity within the system.
- **Error Classes**: Specialized error classes such as `MissingUsernameError` and `WrongUsernameError` to handle username-related exceptions effectively.

## Installation

The library is intended for internal use within the AnyIT platform. If it's available for external use, it can be installed via npm:

```shell
yarn add @anyit/username-dto
```

Ensure your project is configured to access the correct npm registry that hosts the `@anyit/username-dto` package.

## Usage

### Username Management

To utilize the `Username` interface and related error classes, import them into your service or actor handling usernames:

```typescript
import { Username, MissingUsernameError, WrongUsernameError } from '@anyit/username-dto';
```

Implement username validation, creation, and management logic in your application, utilizing the provided interfaces 
and error handling mechanisms to ensure robust username processing.

### Constants

The `USERNAME_ACTOR` and `USERNAME_STORE_ACTOR` constants are used to reference the specific actors within the AnyIT 
actor system responsible for username management and storage:

```typescript
import { USERNAME_ACTOR, USERNAME_STORE_ACTOR } from '@anyit/username-dto';

// Example usage within an actor system
ActorSystem.resolve(USERNAME_ACTOR);
ActorSystem.resolve(USERNAME_STORE_ACTOR);
```

## Contributing

Contributions to the `@anyit/username-dto` library are welcome, especially in areas such as expanding the username 
validation logic, enhancing error handling, and improving integration with other authentication and authorization services.

## License

This project is licensed under the MIT License.
