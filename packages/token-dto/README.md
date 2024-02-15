# @anyit/token-dto Library

The `@anyit/token-dto` library facilitates token management operations within the AnyIT platform, providing structured
data transfer objects (DTOs) for creating and verifying tokens. This library is integrated with the `@anyit/messaging`
system, allowing for seamless message-driven interactions.

## Key Features

- **Token Creation and Verification**: Supports operations for generating new tokens with custom claims and verifying existing tokens.
- **Flexible Claims Structure**: Allows specifying custom claims as part of the token creation process.
- **Integration with Messaging**: Leverages the `@anyit/messaging` infrastructure for sending and receiving token-related operations as messages.

## Installation

To install the library:

```shell
yarn add @anyit/token-dto
```

## Operations

- **CreateToken**: Generates a new token based on provided payload, expiration, and claims.
- **VerifyToken**: Validates a given token and extracts its payload and claims.

### Message Properties

- `CreateToken`
    - `payload`: The data to be encoded in the token.
    - `expiresIn`: Token expiration time.
    - `claims`: Additional claims to be included in the token.
    - `token`: The generated token (populated after token creation).
- `VerifyToken`
    - `token`: The token to be verified.
    - `payloadAndClaims`: The payload and claims extracted from the token (populated after verification).

## Contributing

Contributions to the `@anyit/token-dto` library are encouraged, especially to expand token management capabilities,
enhance security features, and improve integration with other components of the AnyIT ecosystem.

## License

This project is licensed under the MIT License.
