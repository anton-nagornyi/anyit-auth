'use strict';

var messaging = require('@anyit/messaging');

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

exports.CreateRecord = class CreateRecord extends messaging.Message {
    constructor(args) {
        super(args);
        this.record = { ...args.record };
        this.id = args.id ?? 0;
    }
    id;
    record;
};
exports.CreateRecord = __decorate([
    messaging.RegisterMessage('01HEMD4GNN6KD26978VNBNVV77'),
    __metadata("design:paramtypes", [Object])
], exports.CreateRecord);
const isCreateRecord = (message) => Boolean(message && message.code === exports.CreateRecord.code);

exports.DeleteRecord = class DeleteRecord extends messaging.Message {
    constructor(args) {
        super(args);
        this.filter = { ...args.filter };
    }
    filter;
};
exports.DeleteRecord = __decorate([
    messaging.RegisterMessage('01HEMDHQ9B2S29MG746HJBWMRY'),
    __metadata("design:paramtypes", [Object])
], exports.DeleteRecord);
const isDeleteRecord = (message) => Boolean(message && message.code === exports.DeleteRecord.code);

exports.GetNextIdIncremented = class GetNextIdIncremented extends messaging.Message {
    nextId = 0;
};
exports.GetNextIdIncremented = __decorate([
    messaging.RegisterMessage('01HEYE64BW9E2B9F8WG5N9T91K')
], exports.GetNextIdIncremented);
const isGetNextIdIncremented = (message) => Boolean(message && message.code === exports.GetNextIdIncremented.code);

exports.GetRecord = class GetRecord extends messaging.Message {
    constructor(args) {
        super(args);
        this.filter = { ...args.filter };
    }
    record = null;
    filter;
};
exports.GetRecord = __decorate([
    messaging.RegisterMessage('01HEMDF9ZE70C13ZJX2HM6D3WA'),
    __metadata("design:paramtypes", [Object])
], exports.GetRecord);
const isGetRecord = (message) => Boolean(message && message.code === exports.GetRecord.code);

exports.GetRecords = class GetRecords extends messaging.Message {
    constructor(args) {
        super(args);
        this.filter = { ...args.filter };
    }
    records = [];
    filter;
};
exports.GetRecords = __decorate([
    messaging.RegisterMessage('01HES92DSGMMTZR75JDS7Y2546'),
    __metadata("design:paramtypes", [Object])
], exports.GetRecords);
const isGetRecords = (message) => Boolean(message && message.code === exports.GetRecords.code);

exports.UpdateRecord = class UpdateRecord extends messaging.Message {
    constructor(args) {
        super(args);
        this.record = { ...args.record };
    }
    record;
};
exports.UpdateRecord = __decorate([
    messaging.RegisterMessage('01HEMDDP102H5JM269ENA7R3M8'),
    __metadata("design:paramtypes", [Object])
], exports.UpdateRecord);
const isUpdateRecord = (message) => Boolean(message && message.code === exports.UpdateRecord.code);

exports.isCreateRecord = isCreateRecord;
exports.isDeleteRecord = isDeleteRecord;
exports.isGetNextIdIncremented = isGetNextIdIncremented;
exports.isGetRecord = isGetRecord;
exports.isGetRecords = isGetRecords;
exports.isUpdateRecord = isUpdateRecord;
//# sourceMappingURL=index.js.map
