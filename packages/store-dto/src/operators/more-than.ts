import { Operator } from './operator';

export class MoreThan<T> extends Operator<T> {
  constructor(value: T) {
    super('more-than', value);
  }
}
