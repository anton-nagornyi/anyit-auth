import { MessageArgs, Message } from '@anyit/messaging';

type CreateRecordArgs<T> = Omit<MessageArgs<CreateRecord<T>>, 'id'> & {
    id?: number;
};
declare class CreateRecord<T = Record<string, any>> extends Message {
    constructor(args: CreateRecordArgs<T>);
    id: number;
    readonly record: Partial<T>;
}
declare const isCreateRecord: (message?: Message) => message is CreateRecord<Record<string, any>>;

type DeleteRecordArgs<T> = MessageArgs<DeleteRecord<T>>;
declare class DeleteRecord<T = Record<string, any>> extends Message {
    constructor(args: DeleteRecordArgs<T>);
    readonly filter: Partial<T>;
}
declare const isDeleteRecord: (message?: Message) => message is DeleteRecord<Record<string, any>>;

declare class GetNextIdIncremented extends Message {
    nextId: number;
}
declare const isGetNextIdIncremented: (message?: Message) => message is GetNextIdIncremented;

type GetRecordArgs<T> = Omit<MessageArgs<GetRecord<T>>, 'record'>;
declare class GetRecord<T = Record<string, any>> extends Message {
    constructor(args: GetRecordArgs<T>);
    record: T | null;
    readonly filter: Partial<T>;
}
declare const isGetRecord: (message?: Message) => message is GetRecord<Record<string, any>>;

type GetRecordsArgs<T> = Omit<MessageArgs<GetRecords<T>>, 'records'>;
declare class GetRecords<T = Record<string, any>> extends Message {
    constructor(args: GetRecordsArgs<T>);
    records: T[];
    readonly filter: Partial<T>;
}
declare const isGetRecords: (message?: Message) => message is GetRecords<Record<string, any>>;

type UpdateRecordArgs<T> = MessageArgs<UpdateRecord<T>>;
declare class UpdateRecord<T = Record<string, any>> extends Message {
    constructor(args: UpdateRecordArgs<T>);
    readonly record: Partial<T>;
}
declare const isUpdateRecord: (message?: Message) => message is UpdateRecord<Record<string, any>>;

export { CreateRecord, type CreateRecordArgs, DeleteRecord, type DeleteRecordArgs, GetNextIdIncremented, GetRecord, type GetRecordArgs, GetRecords, type GetRecordsArgs, UpdateRecord, type UpdateRecordArgs, isCreateRecord, isDeleteRecord, isGetNextIdIncremented, isGetRecord, isGetRecords, isUpdateRecord };
