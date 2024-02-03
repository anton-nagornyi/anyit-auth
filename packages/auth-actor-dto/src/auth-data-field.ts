export type AuthDataField = {
  name: string;
  type:
    | 'integer'
    | 'float'
    | 'boolean'
    | 'string'
    | 'json'
    | 'datetime'
    | 'date'
    | 'time';
  isNullable: boolean;
};
