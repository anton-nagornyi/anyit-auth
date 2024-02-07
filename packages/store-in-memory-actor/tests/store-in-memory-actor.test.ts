import '@anyit/be-dev';
import {
  CreateRecord,
  DeleteRecord,
  GetNextIdIncremented,
  GetRecord,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Operator,
  UnknownOperatorError,
  UpdateRecord,
} from '@anyit/store-dto';
import { ActorRef, ActorSystem } from '@anyit/actor';
import { GetRecords } from '@anyit/store-dto/src/messages/get-records';
import { StoreInMemoryActor } from '../src/store-in-memory-actor';

describe('StoreInMemoryActor', () => {
  let actor: ActorRef;

  beforeEach(() => {
    actor = ActorSystem.create(StoreInMemoryActor);
  });

  describe('Given the StoreInMemoryActor is initialized', () => {
    describe('When getNextId is called', () => {
      it('Then it should increment and return the next id', async () => {
        const message = new GetNextIdIncremented();
        await actor.ask(message);
        expect(message.nextId).toBe(2);
        await actor.ask(message);
        expect(message.nextId).toBe(3);
      });
    });

    describe('When create is called with a new record', () => {
      it('Then it should store and assign an id to the record', async () => {
        const message = new CreateRecord({ record: { name: 'Test' } });
        await actor.ask(message);
        expect(message.id).toBe(1);
      });
    });

    describe('When delete is called with a filter matching a record', () => {
      let id = 0;
      beforeEach(async () => {
        const { reason } = await actor.ask(
          new CreateRecord({ record: { name: 'DeleteMe' } }),
        );

        id = reason.id;
      });

      it('Then it should remove the record from the store', async () => {
        const { reason: data } = await actor.ask(
          new GetRecord({ filter: { id } }),
        );

        expect(data.record).toMatchObject({ id, name: 'DeleteMe' });

        await actor.ask(new DeleteRecord({ filter: { name: 'DeleteMe' } }));

        const { reason: deleted } = await actor.ask(
          new GetRecord({ filter: { id } }),
        );

        expect(deleted.record).toBeNull();
      });
    });

    describe('When get is called with a filter', () => {
      beforeEach(async () => {
        await actor.ask(new CreateRecord({ record: { name: 'FindMe' } }));
      });

      it('Then it should return the matching record', async () => {
        const message = new GetRecord({ filter: { name: 'FindMe' } });
        await actor.ask(message);
        expect(message.record).toEqual({ id: 1, name: 'FindMe' });
      });
    });

    describe('When update is called on an existing record', () => {
      beforeEach(async () => {
        await actor.ask(
          new CreateRecord({ record: { id: 1, name: 'UpdateMe' } }),
        );
      });

      it('Then it should update the record correctly', async () => {
        await actor.ask(
          new UpdateRecord({ record: { name: 'Updated' }, filter: { id: 1 } }),
        );

        const { reason: data } = await actor.ask(
          new GetRecord({ filter: { id: 1 } }),
        );

        expect(data.record).toMatchObject({ name: 'Updated' });
      });
    });

    describe('When getRecord is called', () => {
      const initialRecords = [
        { id: 1, type: 'cat', name: 'tom', value: 20 },
        { id: 2, type: 'dog', name: 'ben', value: 30 },
        { id: 3, type: 'cat', name: 'john', value: 40 },
        { id: 4, type: 'sam', name: 'john', value: null },
      ];

      beforeEach(async () => {
        await Promise.all(
          initialRecords.map((record) =>
            actor.ask(new CreateRecord({ record })),
          ),
        );
      });

      describe('And an id filter is provided', () => {
        it('Then it returns the record matching the id', async () => {
          const getRecordMessage = new GetRecord({ filter: { id: 1 } });
          const { reason: data } = await actor.ask(getRecordMessage);
          expect(data.record).toEqual(initialRecords[0]);
        });
      });

      describe('And a type filter is provided', () => {
        it('Then it returns the first record matching the type', async () => {
          const getRecordMessage = new GetRecord({ filter: { type: 'dog' } });
          const { reason: data } = await actor.ask(getRecordMessage);
          expect(data.record).toEqual(initialRecords[1]);
        });
      });

      describe('And a filter matching multiple records is provided', () => {
        it('Then it returns the first record that matches the filter', async () => {
          const getRecordMessage = new GetRecord({ filter: { type: 'cat' } });
          const { reason: data } = await actor.ask(getRecordMessage);
          expect(data.record).toEqual(initialRecords[0]);
        });
      });

      describe('And a filter matching no records is provided', () => {
        it('Then it returns null', async () => {
          const getRecordMessage = new GetRecord({ filter: { type: 'bird' } });
          const { reason: data } = await actor.ask(getRecordMessage);
          expect(data.record).toBeNull();
        });
      });

      describe('And a complex filter is provided', () => {
        it('Then it returns the first record that matches all filter criteria', async () => {
          const getRecordMessage = new GetRecord({
            filter: { type: 'cat', name: 'tom' },
          });
          const { reason: data } = await actor.ask(getRecordMessage);
          expect(data.record).toEqual(initialRecords[0]);
        });
      });

      describe('And no filter is provided', () => {
        it('Then it should ideally return the first record or null based on implementation', async () => {
          const getRecordMessage = new GetRecord({ filter: {} });
          const { reason: data } = await actor.ask(getRecordMessage);
          expect(data.record).toBeNull();
        });
      });

      describe('And using LessThan operator', () => {
        it('Then it filters records with values less than 25', async () => {
          const message = new GetRecord({
            filter: { value: new LessThan(25) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.record).toEqual(initialRecords[0]);
        });
      });

      describe('And using LessThanOrEqual operator', () => {
        it('Then it filters records with values less than or equal 30', async () => {
          const message = new GetRecord({
            filter: { value: new LessThanOrEqual(30) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.record).toEqual(initialRecords[0]);
        });
      });

      describe('And using MoreThan operator', () => {
        it('Then it filters records with values more than 15', async () => {
          const message = new GetRecord({
            filter: { value: new MoreThan(15) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.record).toEqual(initialRecords[0]);
        });
      });

      describe('And using MoreThanOrEqual operator', () => {
        it('Then it filters records with values more than or equal 30', async () => {
          const message = new GetRecord({
            filter: { value: new MoreThanOrEqual(30) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.record).toEqual(initialRecords[1]);
        });
      });

      describe('And using Not operator', () => {
        it('Then it filters records not equal to 20', async () => {
          const message = new GetRecord({
            filter: { value: new Not(20) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.record).toEqual(initialRecords[1]);
        });
      });

      describe('And IsNull operator', () => {
        it('Then it finds records with null values', async () => {
          const message = new GetRecord({
            filter: { value: new IsNull() },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.record).toEqual(initialRecords[3]);
        });
      });

      describe('And applying an unknown operator', () => {
        it('Then it throws UnknownOperatorError', async () => {
          class UnknownOperator extends Operator<any> {}

          const message = new GetRecord({
            filter: { value: new UnknownOperator('unknown-operator', null) },
          });

          const { error } = await actor.ask(message);
          expect(error).toBeInstanceOf(UnknownOperatorError);
        });
      });
    });

    describe('When getRecords is called', () => {
      const initialRecords = [
        { id: 1, type: 'cat', name: 'tom', value: 20 },
        { id: 2, type: 'dog', name: 'ben', value: 30 },
        { id: 3, type: 'cat', name: 'john', value: 40 },
        { id: 4, type: 'sam', name: 'sam', value: null },
      ];

      beforeEach(async () => {
        await Promise.all(
          initialRecords.map((record) =>
            actor.ask(new CreateRecord({ record })),
          ),
        );
      });

      describe('And a specific filter is provided', () => {
        it('Then it returns all matching records', async () => {
          const getRecordsMessage = new GetRecords({ filter: { type: 'cat' } });
          const { reason: data } = await actor.ask(getRecordsMessage);
          expect(data.records).toEqual([initialRecords[0], initialRecords[2]]);
        });
      });

      describe('And a filter matches no records', () => {
        it('Then it returns an empty array', async () => {
          const getRecordsMessage = new GetRecords({
            filter: { name: 'oops' },
          });
          const { reason: data } = await actor.ask(getRecordsMessage);
          expect(data.records).toEqual([]);
        });
      });

      describe('And an id filter is provided', () => {
        it('Then it returns a single record matching the id', async () => {
          const getRecordsMessage = new GetRecords({ filter: { id: 2 } });
          const { reason: data } = await actor.ask(getRecordsMessage);
          expect(data.records).toEqual([initialRecords[1]]);
        });
      });

      describe('And no filter is provided', () => {
        it('Then it returns all records', async () => {
          const getRecordsMessage = new GetRecords({ filter: {} });
          const { reason: data } = await actor.ask(getRecordsMessage);
          expect(data.records.length).toBe(initialRecords.length);
        });
      });

      describe('And using LessThan operator', () => {
        it('Then it filters records with values less than 40', async () => {
          const message = new GetRecords({
            filter: { value: new LessThan(40) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.records).toEqual([initialRecords[0], initialRecords[1]]);
        });
      });

      describe('And using LessThanOrEqual operator', () => {
        it('Then it filters records with values less than or equal 30', async () => {
          const message = new GetRecords({
            filter: { value: new LessThanOrEqual(30) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.records).toEqual([initialRecords[0], initialRecords[1]]);
        });
      });

      describe('And using MoreThan operator', () => {
        it('Then it filters records with values more than 20', async () => {
          const message = new GetRecords({
            filter: { value: new MoreThan(20) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.records).toEqual([initialRecords[1], initialRecords[2]]);
        });
      });

      describe('And using MoreThanOrEqual operator', () => {
        it('Then it filters records with values more than or equal 30', async () => {
          const message = new GetRecords({
            filter: { value: new MoreThanOrEqual(30) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.records).toEqual([initialRecords[1], initialRecords[2]]);
        });
      });

      describe('And using Not operator', () => {
        it('Then it filters records not equal to 20', async () => {
          const message = new GetRecords({
            filter: { value: new Not(20) },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.records).toEqual([
            initialRecords[1],
            initialRecords[2],
            initialRecords[3],
          ]);
        });
      });

      describe('And IsNull operator', () => {
        it('Then it finds records with null values', async () => {
          const message = new GetRecords({
            filter: { value: new IsNull() },
          });
          const { reason: data } = await actor.ask(message);
          expect(data.records).toEqual([initialRecords[3]]);
        });
      });

      describe('And applying an unknown operator', () => {
        it('Then it throws UnknownOperatorError', async () => {
          class UnknownOperator extends Operator<any> {}

          const message = new GetRecord({
            filter: { value: new UnknownOperator('unknown-operator', null) },
          });

          const { error } = await actor.ask(message);
          expect(error).toBeInstanceOf(UnknownOperatorError);
        });
      });
    });
  });
});
