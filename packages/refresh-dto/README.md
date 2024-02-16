# @anyit/refresh-dto Library

The `@anyit/refresh-dto` library is crafted to facilitate refresh token operations within the AnyIT platform, 
offering a suite of data transfer objects (DTOs) for the creation, verification, deletion, and management of refresh 
tokens. Integrated with the `@anyit/messaging` framework, it ensures seamless, message-driven workflows for handling
refresh tokens.

## Key Features

- **Comprehensive Refresh Token Operations**: Enables the creation, deletion, revocation, verification, and retrieval of token IDs for refresh tokens.
- **Customizable Access Claims**: Supports specifying access claims for refresh tokens, allowing for flexible authorization strategies.
- **Error Handling**: Incorporates `MaxRefreshTokensLimitError` and `MissingRefreshTokenError` to provide clear feedback on operational issues.

## Installation

To add the library to your project:

```shell
yarn add @anyit/refresh-dto
```

## Operations

- **CreateRefresh**: Initiates a new refresh token.
- **DeleteRefresh**: Removes an existing refresh token from the system.
- **RevokeRefresh**: Flags a refresh token as revoked, preventing its further use.
- **VerifyRefresh**: Checks the validity of a refresh token, extracting its claims and identity ID.
- **GetTokenId**: Retrieves the token ID for a given refresh token, facilitating token management tasks.

## License

This project is licensed under the MIT License.
