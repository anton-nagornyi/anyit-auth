# @anyit/password-actor Library

This library provides the `PasswordActor` class, designed for handling password-related operations within an
actor-based system. It leverages `argon2` for password hashing and verification, utilizes `luxon` for date and 
time management, and integrates with `@anyit/password-dto` and `@anyit/auth-actor-dto` for a seamless messaging 
experience.

## Installation

To install the library, run:

```shell
yarn add @anyit/password-actor
```

## Initialization

To create a `PasswordActor` within your actor system, use the following snippet:

```typescript
import { ActorSystem } from '@anyit/actor';
import { PasswordActor } from '@anyit/password-actor';
import { PasswordMinLengthRule, PasswordMaxLengthRule } from '@anyit/password-dto';

const passwordActor = ActorSystem.create(PasswordActor, {
  // PasswordActorArgs configuration
  store: yourStoreActorRef, // Reference to your store actor
  passwordRules: [new PasswordMinLengthRule(8), new PasswordMaxLengthRule(128)],
  resetTokenExpireMs: 3600000, // 1 hour for reset token expiration
  // Additional configuration options as needed
});
```

## Handled Messages

### Messages and Operations

The `PasswordActor` handles the following messages to perform corresponding actions:

- **VerifyUserCreation**: Validates password rules during user creation.
- **CreatePassword**: Hashes and stores the password for a newly created user.
- **DeleteUser**: Removes a user's password information from the store.
- **SignInUser**: Verifies a user's password during the sign-in process.
- **ChangePassword**: Updates a user's password.
- **ResetPassword**: Processes password reset requests and updates the password accordingly.
- **RequestPasswordReset**: Initiates the password reset process by generating a reset token.

## Password Rules

`@anyit/password-dto` provides a set of rules to validate password strength and complexity:

- **PasswordMinLengthRule**: Ensures passwords meet a minimum length requirement.
- **PasswordMaxLengthRule**: Ensures passwords do not exceed a maximum length.
- **PasswordCharacterDiversityRule**: Requires passwords to include a diverse set of character types.
- **PasswordNoCommonRule**: Prevents the use of commonly used passwords.
- **PasswordNoRepeatedCharactersRule**: Restricts repeated consecutive characters in passwords.
- **PasswordNoSequentialCharactersRule**: Prohibits sequential characters to increase complexity.
- **PasswordRegexpMatchRule**: Allows custom regular expression patterns for password validation.


### Examples

#### Verify User Creation

To verify a user's password during creation:

```typescript
passwordActor.tell(new VerifyUserCreation({
  auth: { password: 'SecurePassword123!' },
  profile: {},
}));
```

#### Create Password

To hash and store a new user's password:

```typescript
passwordActor.tell(new CreateUser({
  id: 1,
  auth: { password: 'SecurePassword123!' },
  profile: {},
}));
```

#### Sign In User

To verify a user's sign-in attempt:

```typescript
passwordActor.tell(new SignInUser({
  id: 1,
  auth: { password: 'SecurePassword123!' }
}));
```

#### Change Password

To change a user's password:

```typescript
passwordActor.tell(new ChangePassword({
  id: 1,
  password: 'NewSecurePassword456!'
}));
```

#### Request Password Reset

To initiate a password reset process:

```typescript
passwordActor.tell(new RequestPasswordReset({
  id: 1
}));
```

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
