export abstract class Operator<T> {
  constructor(
    readonly type: string,
    readonly value: T,
  ) {}
}
