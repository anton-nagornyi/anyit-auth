# @anyit/auth-actor-dto Library

This library provides a suite of Data Transfer Objects (DTOs) for authentication-related operations, supporting actions
like authorizing users, creating refresh tokens, user creation, sign-in, and deletion. It is designed to integrate 
seamlessly with the `@anyit/messaging` system for message-driven architectures.

## Installation

To install the library, run:

```shell
yarn add @anyit/auth-actor-dto
```

## Usage

The library offers several classes for handling authentication and authorization operations:

### AuthorizeUser

`AuthorizeUser` is used to authorize a user, potentially including permissions.

### CreateRefreshToken

`CreateRefreshToken` is used for creating a refresh token for a user session.

### CreateUser

`CreateUser` is used for creating a new user record, including profile and authentication data.

### DeleteUser

`DeleteUser` is used to delete a user record.

### SignInUser

`SignInUser` is used for signing a user in, generating an access token.

### VerifyUserCreation

`VerifyUserCreation` is used to verify the creation of a user, extending the `CreateUser` class.

## API Reference

- **DTO Classes**
    - `AuthorizeUser`
    - `CreateRefreshToken`
    - `CreateUser`
    - `DeleteUser`
    - `SignInUser`
    - `VerifyUserCreation`
- **Type Guards**
    - `isAuthorizeUser`
    - `isCreateRefreshToken`
    - `isCreateUser`
    - `isDeleteUser`
    - `isSignInUser`
    - `isVerifyUserCreation`

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
