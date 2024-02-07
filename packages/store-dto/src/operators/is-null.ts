import { Operator } from './operator';

export class IsNull extends Operator<null> {
  constructor() {
    super('is-null', null);
  }
}
