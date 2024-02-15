# @anyit/profile-dto Library

The `@anyit/profile-dto` library is designed to streamline profile management within the AnyIT ecosystem, offering 
structured data transfer objects (DTOs) for profile-related operations. It's built on the `@anyit/messaging` framework, 
facilitating message-driven interactions for retrieving user profiles.

## Key Features

- **Profile Retrieval**: Enables the fetching of user profiles by ID, supporting flexible profile structures through generic typing.
- **Constants for Actor References**: Provides constants `PROFILE_ACTOR` and `PROFILE_STORE_ACTOR` for easy reference to the actors responsible for profile management and storage.
- **Integration with Messaging**: Leverages the `@anyit/messaging` system for efficient message processing and handling.

## Installation

To install the library:

```shell
yarn add @anyit/profile-dto
```


### Constants

Utilize `PROFILE_ACTOR` and `PROFILE_STORE_ACTOR` for actor lookups within the system:

```typescript
import { ActorSystem } from '@anyit/actor';
import { PROFILE_ACTOR, PROFILE_STORE_ACTOR } from '@anyit/profile-dto';

// Example: Resolving profile actor
ActorSystem.resolve(PROFILE_ACTOR);
// Example: Resolving profile store actor
ActorSystem.resolve(PROFILE_STORE_ACTOR);
```

## Operations

- **GetProfile**: Fetches the specified profile by ID, populating the `profile` field upon successful retrieval.

## License

This project is licensed under the MIT License.
