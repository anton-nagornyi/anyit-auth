import { DateTime } from 'luxon';
import { MessageArgs, Message } from '@anyit/messaging';

declare const PASSWORD_ACTOR = "password-actor-01HG7P19H8H0FHX0QRHPBEMF5D";
declare const PASSWORD_STORE_ACTOR = "password-store-actor-01HG7P1CKKZ9Z97WMR4N2AXZ8B";
declare const PASSWORD_RESET_MESSENGER = "password-reset-messenger-01HMR3BF2ZM5XX8KBZVP8T8W3M";
declare const PASSWORD_RESET_REQUEST_MESSENGER = "password-reset-request-messenger-01HMR3BTZ13DN10H8VPD7CAM2P";

interface Password {
    id: number;
    passwordHash: string;
    resetToken: string | null;
    resetTokenExpiresAt: DateTime | null;
}

declare class InvalidPasswordError extends Error {
    constructor(message?: string);
    code: string;
}

declare class MissingPasswordError extends Error {
    constructor();
    code: string;
}

declare class ResetTokenExpiredError extends Error {
    constructor();
    code: string;
}

declare class WrongPasswordError extends Error {
    constructor();
    code: string;
}

declare class WrongResetTokenError extends Error {
    constructor();
    code: string;
}

type PasswordAuthArgs = MessageArgs<PasswordAuth>;
declare class PasswordAuth extends Message {
    constructor(args: PasswordAuthArgs);
    readonly id: number;
    readonly password: string;
    toJSON(): any;
}
declare const isPasswordAuth: (message?: Message) => message is PasswordAuth;

declare class ChangePassword extends PasswordAuth {
}

type DeletePasswordArgs = MessageArgs<DeletePassword>;
declare class DeletePassword extends Message {
    constructor(args: DeletePasswordArgs);
    readonly id: number;
}
declare const isDeletePassword: (message?: Message) => message is DeletePassword;

type RequestPasswordResetArgs = Omit<MessageArgs<RequestPasswordReset>, 'resetToken'> & {
    resetToken?: string;
};
declare class RequestPasswordReset extends Message {
    constructor(args: RequestPasswordResetArgs);
    readonly id: number;
    resetToken?: string;
}
declare const isRequestPasswordReset: (message?: Message) => message is RequestPasswordReset;

type ResetPasswordArgs = MessageArgs<ResetPassword>;
declare class ResetPassword extends PasswordAuth {
    constructor(args: ResetPasswordArgs);
    readonly resetToken: string;
}
declare const isResetPassword: (message?: Message) => message is ResetPassword;

declare abstract class PasswordRule {
    abstract validate(password: string): Promise<boolean>;
    abstract description(): string;
}

declare class PasswordCharacterDiversityRule extends PasswordRule {
    private readonly regexpMatch;
    validate(password: string): Promise<boolean>;
    description(): string;
}

declare class PasswordMaxLengthRule extends PasswordRule {
    readonly maxLength: number;
    constructor(maxLength?: number);
    validate(password: string): Promise<boolean>;
    description(): string;
}

declare class PasswordMinLengthRule extends PasswordRule {
    readonly minLength: number;
    constructor(minLength?: number);
    validate(password: string): Promise<boolean>;
    description(): string;
}

declare class PasswordNoCommonRule extends PasswordRule {
    constructor(commonPasswords?: string[]);
    private readonly forbiddenPasswords;
    validate(password: string): Promise<boolean>;
    description(): string;
}

declare class PasswordNoRepeatedCharactersRule extends PasswordRule {
    readonly allowedRepeats: number;
    constructor(allowedRepeats?: number);
    validate(password: string): Promise<boolean>;
    description(): string;
}

declare class PasswordNoSequentialCharactersRule extends PasswordRule {
    validate(password: string): Promise<boolean>;
    description(): string;
}

declare class PasswordRegexpMatchRule extends PasswordRule {
    readonly regExp: string | RegExp;
    readonly customDescription: null;
    constructor(regExp: string | RegExp, customDescription?: null);
    validate(password: string): Promise<boolean>;
    description(): string;
}

export { ChangePassword, DeletePassword, type DeletePasswordArgs, InvalidPasswordError, MissingPasswordError, PASSWORD_ACTOR, PASSWORD_RESET_MESSENGER, PASSWORD_RESET_REQUEST_MESSENGER, PASSWORD_STORE_ACTOR, type Password, PasswordAuth, type PasswordAuthArgs, PasswordCharacterDiversityRule, PasswordMaxLengthRule, PasswordMinLengthRule, PasswordNoCommonRule, PasswordNoRepeatedCharactersRule, PasswordNoSequentialCharactersRule, PasswordRegexpMatchRule, PasswordRule, RequestPasswordReset, type RequestPasswordResetArgs, ResetPassword, type ResetPasswordArgs, ResetTokenExpiredError, WrongPasswordError, WrongResetTokenError, isDeletePassword, isPasswordAuth, isRequestPasswordReset, isResetPassword };
