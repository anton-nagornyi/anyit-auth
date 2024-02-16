# @anyit/profile-actor Library

The `@anyit/profile-actor` library orchestrates profile management operations within the AnyIT ecosystem, 
leveraging `@anyit/actor` for actor-based interaction, `@anyit/message-handing` for message processing, and 
integrating with `@anyit/store-dto` and `@anyit/profile-dto` for handling profile data.

## Key Features

- **Comprehensive Profile Management**: Facilitates the creation, update, and retrieval of user profiles.
- **Dynamic Field Validation**: Dynamically manages allowed fields for profile records based on registered authentication and authorization actors.
- **Custom Verification Logic**: Supports custom logic for verifying user creation through an optional verification handler.

## Installation

To install the library:

```shell
ayrn add @anyit/profile-actor
```

## Usage

### Initializing the ProfileActor

Instantiate a `ProfileActor` with a reference to the store actor and optionally provide a custom verification handler:

```typescript
import { ProfileActor } from '@anyit/profile-actor';
import { ActorSystem } from '@anyit/actor';

const profileActor = ActorSystem.create(ProfileActor, {
  store: storeActorRef,
  verifyCreation: async (message) => {
    // Custom verification logic
  }
});
```

### Operations

- **RegisterAuthActor**: Registers authentication and authorization actors to define allowed fields for profile records.
- **CreateRecord**: Creates or updates a profile record, filtering fields based on allowed list.
- **UpdateRecord**: Updates a profile record with filtered fields.
- **GetProfile**: Retrieves a profile record by ID.
- **VerifyUserCreation**: Optionally applies custom logic to verify user creation.

### Handling Profile Data

To create or update a profile record, ensuring only allowed fields are included:

```typescript
profileActor.tell(new CreateRecord({
  id: userId,
  record: { /* profile data */ }
}));
```

To retrieve a profile:

```typescript
const { reason } = await profileActor.ask(new GetProfile({
  id: userId
}));

console.log(reason.record);
```

## License

This project is licensed under the MIT License.
