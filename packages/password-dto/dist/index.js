'use strict';

var messaging = require('@anyit/messaging');

const PASSWORD_ACTOR = 'password-actor-01HG7P19H8H0FHX0QRHPBEMF5D';
const PASSWORD_STORE_ACTOR = 'password-store-actor-01HG7P1CKKZ9Z97WMR4N2AXZ8B';
const PASSWORD_RESET_MESSENGER = 'password-reset-messenger-01HMR3BF2ZM5XX8KBZVP8T8W3M';
const PASSWORD_RESET_REQUEST_MESSENGER = 'password-reset-request-messenger-01HMR3BTZ13DN10H8VPD7CAM2P';

class InvalidPasswordError extends Error {
    constructor(message) {
        super(message ?? 'Invalid password');
    }
    code = 'INVALID_PASSWORD_ERROR';
}

class MissingPasswordError extends Error {
    constructor() {
        super('Missing password');
    }
    code = 'MISSING_PASSWORD_ERROR';
}

class ResetTokenExpiredError extends Error {
    constructor() {
        super('Reset token expired');
    }
    code = 'RESET_TOKEN_EXPIRED';
}

class WrongPasswordError extends Error {
    constructor() {
        super('Wrong otp');
    }
    code = 'WRONG_PASSWORD';
}

class WrongResetTokenError extends Error {
    constructor() {
        super('Wrong reset token');
    }
    code = 'WRONG_RESET_TOKEN';
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

exports.PasswordAuth = class PasswordAuth extends messaging.Message {
    constructor(args) {
        super(args);
        this.password = args.password;
        this.id = args.id;
    }
    id;
    password;
    toJSON() {
        return {
            ...super.toJSON(),
            password: '*****',
        };
    }
};
exports.PasswordAuth = __decorate([
    messaging.RegisterMessage('01HBV2B6WM4YPXWFES6CS3646M'),
    __metadata("design:paramtypes", [Object])
], exports.PasswordAuth);
const isPasswordAuth = (message) => Boolean(message && message.code === exports.PasswordAuth.code);

exports.ChangePassword = class ChangePassword extends exports.PasswordAuth {
};
exports.ChangePassword = __decorate([
    messaging.RegisterMessage('01HBWPF5T9J5N2F56CWB4BJZAA')
], exports.ChangePassword);

exports.DeletePassword = class DeletePassword extends messaging.Message {
    constructor(args) {
        super(args);
        this.id = args.id;
    }
    id;
};
exports.DeletePassword = __decorate([
    messaging.RegisterMessage('01HEHW5ZYS4VFY2F5BBW8FN5NV'),
    __metadata("design:paramtypes", [Object])
], exports.DeletePassword);
const isDeletePassword = (message) => Boolean(message && message.code === exports.DeletePassword.code);

exports.RequestPasswordReset = class RequestPasswordReset extends messaging.Message {
    constructor(args) {
        super(args);
        this.resetToken = args.resetToken;
        this.id = args.id;
    }
    id;
    resetToken;
};
exports.RequestPasswordReset = __decorate([
    messaging.RegisterMessage('01HBWRJT57T9PDNPT1FXFCJ1H1'),
    __metadata("design:paramtypes", [Object])
], exports.RequestPasswordReset);
const isRequestPasswordReset = (message) => Boolean(message && message.code === exports.RequestPasswordReset.code);

exports.ResetPassword = class ResetPassword extends exports.PasswordAuth {
    constructor(args) {
        super(args);
        this.resetToken = args.resetToken;
    }
    resetToken;
};
exports.ResetPassword = __decorate([
    messaging.RegisterMessage('01HBWP9N2D6GN3D0ES9FVD56VW'),
    __metadata("design:paramtypes", [Object])
], exports.ResetPassword);
const isResetPassword = (message) => Boolean(message && message.code === exports.ResetPassword.code);

class PasswordRule {
}

class PasswordRegexpMatchRule extends PasswordRule {
    regExp;
    customDescription;
    constructor(regExp, customDescription = null) {
        super();
        this.regExp = regExp;
        this.customDescription = customDescription;
    }
    validate(password) {
        return Promise.resolve(Boolean(password.match(this.regExp)));
    }
    description() {
        return (this.customDescription ??
            `Password must match the expression ${this.regExp.toString()}`);
    }
}

class PasswordCharacterDiversityRule extends PasswordRule {
    regexpMatch = new PasswordRegexpMatchRule(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?\\|`~-]).*$/);
    validate(password) {
        return this.regexpMatch.validate(password);
    }
    description() {
        return 'Password must include at least one uppercase letter, one lowercase letter, one number and one special character';
    }
}

class PasswordMaxLengthRule extends PasswordRule {
    maxLength;
    constructor(maxLength = 64) {
        super();
        this.maxLength = maxLength;
    }
    validate(password) {
        return Promise.resolve(password.length < this.maxLength);
    }
    description() {
        return `Password length must be less than ${this.maxLength}`;
    }
}

class PasswordMinLengthRule extends PasswordRule {
    minLength;
    constructor(minLength = 8) {
        super();
        this.minLength = minLength;
    }
    validate(password) {
        return Promise.resolve(password.length >= this.minLength);
    }
    description() {
        return `Password length must be greater than ${this.minLength}`;
    }
}

const defaultCommonPasswords = [
    '123456',
    'password',
    '123456789',
    '12345',
    '12345678',
    'qwerty',
    '1234567',
    '111111',
    '1234567890',
    '123123',
    'abc123',
    '1234',
    'password1',
    'iloveyou',
    '1q2w3e4r',
    '000000',
    'qwerty123',
    'zaq12wsx',
    'dragon',
    'sunshine',
    'princess',
    'letmein',
    '654321',
    'monkey',
    '27653',
    '1qaz2wsx',
    '123321',
    'qwertyuiop',
    'superman',
    'asdfghjkl',
];
class PasswordNoCommonRule extends PasswordRule {
    constructor(commonPasswords = defaultCommonPasswords) {
        super();
        this.forbiddenPasswords = new Set(commonPasswords);
    }
    forbiddenPasswords;
    validate(password) {
        return Promise.resolve(!this.forbiddenPasswords.has(password));
    }
    description() {
        return 'Commonly used passwords are not allowed';
    }
}

class PasswordNoRepeatedCharactersRule extends PasswordRule {
    allowedRepeats;
    constructor(allowedRepeats = 2) {
        super();
        this.allowedRepeats = allowedRepeats;
    }
    validate(password) {
        for (let i = 0; i < password.length - this.allowedRepeats; ++i) {
            let series = 1;
            for (let j = i + 1; j < i + 1 + this.allowedRepeats; ++j) {
                if (password[i] === password[j]) {
                    ++series;
                }
                else {
                    break;
                }
            }
            if (series > this.allowedRepeats) {
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    }
    description() {
        return `Maximum allowed character repeats is ${this.allowedRepeats}`;
    }
}

class PasswordNoSequentialCharactersRule extends PasswordRule {
    validate(password) {
        for (let i = 0; i < password.length - 2; i++) {
            const charCode1 = password.charCodeAt(i);
            const charCode2 = password.charCodeAt(i + 1);
            const charCode3 = password.charCodeAt(i + 2);
            if ((charCode2 === charCode1 + 1 && charCode3 === charCode2 + 1) ||
                (charCode2 === charCode1 - 1 && charCode3 === charCode2 - 1)) {
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    }
    description() {
        return 'No sequential characters allowed';
    }
}

exports.InvalidPasswordError = InvalidPasswordError;
exports.MissingPasswordError = MissingPasswordError;
exports.PASSWORD_ACTOR = PASSWORD_ACTOR;
exports.PASSWORD_RESET_MESSENGER = PASSWORD_RESET_MESSENGER;
exports.PASSWORD_RESET_REQUEST_MESSENGER = PASSWORD_RESET_REQUEST_MESSENGER;
exports.PASSWORD_STORE_ACTOR = PASSWORD_STORE_ACTOR;
exports.PasswordCharacterDiversityRule = PasswordCharacterDiversityRule;
exports.PasswordMaxLengthRule = PasswordMaxLengthRule;
exports.PasswordMinLengthRule = PasswordMinLengthRule;
exports.PasswordNoCommonRule = PasswordNoCommonRule;
exports.PasswordNoRepeatedCharactersRule = PasswordNoRepeatedCharactersRule;
exports.PasswordNoSequentialCharactersRule = PasswordNoSequentialCharactersRule;
exports.PasswordRegexpMatchRule = PasswordRegexpMatchRule;
exports.PasswordRule = PasswordRule;
exports.ResetTokenExpiredError = ResetTokenExpiredError;
exports.WrongPasswordError = WrongPasswordError;
exports.WrongResetTokenError = WrongResetTokenError;
exports.isDeletePassword = isDeletePassword;
exports.isPasswordAuth = isPasswordAuth;
exports.isRequestPasswordReset = isRequestPasswordReset;
exports.isResetPassword = isResetPassword;
//# sourceMappingURL=index.js.map
