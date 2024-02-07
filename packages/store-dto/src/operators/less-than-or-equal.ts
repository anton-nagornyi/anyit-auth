import { Operator } from './operator';

export class LessThanOrEqual<T> extends Operator<T> {
  constructor(value: T) {
    super('less-than-or-equal', value);
  }
}
