# @anyit/password-dto Library

This library provides a suite of classes and types for handling password-related operations. 
It includes DTOs (Data Transfer Objects) for password authentication, change, deletion, reset requests, and various 
password rules for validation.

## Installation

To install the library, run:

```shell
yarn add @anyit/password-dto
```

## Usage

The library offers several classes and types for handling different aspects of password management:


### ChangePassword

`ChangePassword` is used when changing a user's password.

### DeletePassword

`DeletePassword` is used to delete a password, requiring the user's ID.

### RequestPasswordReset

`RequestPasswordReset` is used for initiating a password reset process.

### ResetPassword

`ResetPassword` is used to reset a user's password using a reset token.

### Password Rules

Several rules are provided for password validation, such as `PasswordCharacterDiversityRule`, `PasswordMaxLengthRule`,
etc.

## API Reference

- **DTO Classes**
    - `PasswordAuth`
    - `ChangePassword`
    - `DeletePassword`
    - `RequestPasswordReset`
    - `ResetPassword`
- **Password Rules**
    - `PasswordCharacterDiversityRule`
    - `PasswordMaxLengthRule`
    - `PasswordMinLengthRule`
    - `PasswordNoCommonRule`
    - `PasswordNoRepeatedCharactersRule`
    - `PasswordNoSequentialCharactersRule`
    - `PasswordRegexpMatchRule`
- **Error Classes**
    - `InvalidPasswordError`
    - `MissingPasswordError`
    - `ResetTokenExpiredError`
    - `WrongPasswordError`
    - `WrongResetTokenError`
- **Constants**
    - `PASSWORD_ACTOR`
    - `PASSWORD_STORE_ACTOR`
    - `PASSWORD_RESET_MESSENGER`
    - `PASSWORD_RESET_REQUEST_MESSENGER`

## License

This project is licensed under the MIT License.
