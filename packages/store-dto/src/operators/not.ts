import { Operator } from './operator';

export class Not<T> extends Operator<T> {
  constructor(value: T) {
    super('not', value);
  }
}
