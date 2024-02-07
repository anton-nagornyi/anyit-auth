import { Operator } from './operator';

export class MoreThanOrEqual<T> extends Operator<T> {
  constructor(value: T) {
    super('more-than-or-equal', value);
  }
}
