import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Operator,
  UnknownOperatorError,
} from '@anyit/store-dto';

type OperatorFunc = (value: any, operator?: any) => boolean;

const isNullOrUndefined = (value: any) => value === null || value === undefined;

const operators = new Map<string, OperatorFunc>([
  ['is-null', (value: any) => value === null],
  ['not', (value: any, operator: Not<any>) => value !== operator.value],
  [
    'less-than',
    (value: any, operator: LessThan<any>) =>
      !isNullOrUndefined(value) && value < operator.value,
  ],
  [
    'less-than-or-equal',
    (value: any, operator: LessThanOrEqual<any>) =>
      !isNullOrUndefined(value) && value <= operator.value,
  ],
  [
    'more-than',
    (value: any, operator: MoreThan<any>) =>
      !isNullOrUndefined(value) && value > operator.value,
  ],
  [
    'more-than-or-equal',
    (value: any, operator: MoreThanOrEqual<any>) =>
      !isNullOrUndefined(value) && value >= operator.value,
  ],
]);

export const applyOperator = (value: any, operator: Operator<any>) => {
  const operatorFunc = operators.get(operator.type);

  if (!operatorFunc) {
    throw new UnknownOperatorError(operator.type);
  }

  return operatorFunc(value, operator);
};
