import { Actor } from '@anyit/actor';
import { Receive } from '@anyit/message-handling';
import {
  CreateRecord,
  DeleteRecord,
  GetNextIdIncremented,
  GetRecord,
  UpdateRecord,
} from '@anyit/store-dto';
import { GetRecords } from '@anyit/store-dto/src/messages/get-records';
import { mergeDeep } from './utils';

export class StoreInMemoryActor extends Actor {
  private nextId = 1;

  private readonly store = new Map<number, Record<string, any>>();

  getNextId(@Receive message: GetNextIdIncremented) {
    message.nextId = ++this.nextId;
  }

  create(@Receive message: CreateRecord) {
    const { record } = message;
    const id = record.id ? record.id : this.nextId++;
    this.store.set(id, { id, ...record });
    record.id = id;
    message.id = id;
  }

  delete(@Receive { filter }: DeleteRecord) {
    const filterEntries = Object.entries(filter);

    for (const storedItem of this.store.values()) {
      let isSatisfyingItem = true;
      for (const [field, value] of filterEntries) {
        if (storedItem[field] !== value) {
          isSatisfyingItem = false;
          break;
        }
      }

      if (isSatisfyingItem) {
        this.store.delete(storedItem.id);
      }
    }
  }

  get(@Receive message: GetRecord) {
    const { filter } = message;
    const filterEntries = Object.entries(filter);

    if (filterEntries.length === 1 && filterEntries[0][1] === 'id') {
      return Promise.resolve(this.store.get(filter.id) ?? null);
    }

    let result: Record<string, any> | null = null;

    if (filterEntries.length > 0) {
      for (const storedItem of this.store.values()) {
        let isSatisfyingItem = true;
        for (const [field, value] of filterEntries) {
          if (storedItem[field] !== value) {
            isSatisfyingItem = false;
            break;
          }
        }

        if (isSatisfyingItem) {
          result = storedItem;
          break;
        }
      }
    }

    message.record = result;
  }

  getRecords(@Receive message: GetRecords) {
    const { filter } = message;
    const filterEntries = Object.entries(filter);

    if (filterEntries.length === 1 && filterEntries[0][1] === 'id') {
      return Promise.resolve(this.store.get(filter.id) ?? null);
    }

    const result: Record<string, any>[] = [];

    for (const storedItem of this.store.values()) {
      let isSatisfyingItem = true;
      for (const [field, value] of filterEntries) {
        if (storedItem[field] !== value) {
          isSatisfyingItem = false;
        }
      }

      if (isSatisfyingItem) {
        result.push(storedItem);
      }
    }

    message.records = result;
  }

  update(@Receive { record }: UpdateRecord) {
    const currentRecord = this.store.get(record.id) ?? {};
    this.store.set(record.id, mergeDeep(currentRecord, record));
  }
}
