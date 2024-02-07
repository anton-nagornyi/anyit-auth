import { Operator } from './operator';

export class LessThan<T> extends Operator<T> {
  constructor(value: T) {
    super('less-than', value);
  }
}
