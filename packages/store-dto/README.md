# @anyit/store-dto Library

This library provides a set of Data Transfer Objects (DTOs) for operations related to storing and managing records. 
It is built on top of the `@anyit/messaging` system, facilitating the creation, deletion, retrieval, and updating of
records in a message-driven architecture.

## Installation

To install the library, run:

```shell
yarn add @anyit/store-dto
```

## Usage

The library offers several classes for handling different store operations:

### CreateRecord

`CreateRecord` is used for creating a new record. It optionally includes an `id` and the record data.


### DeleteRecord

`DeleteRecord` is used to delete a record based on a filter.


### GetNextIdIncremented

`GetNextIdIncremented` is a message used to retrieve the next incremented ID.

### GetRecord

`GetRecord` is used to retrieve a single record based on a filter.

### GetRecords

`GetRecords` is used to retrieve multiple records based on a filter.

### UpdateRecord

`UpdateRecord` is used to update a record based on provided data.

## API Reference

- **DTO Classes**
    - `CreateRecord`
    - `DeleteRecord`
    - `GetNextIdIncremented`
    - `GetRecord`
    - `GetRecords`
    - `UpdateRecord`
- **Type Guards**
    - `isCreateRecord`
    - `isDeleteRecord`
    - `isGetNextIdIncremented`
    - `isGetRecord`
    - `isGetRecords`
    - `isUpdateRecord`

## Operators

- **IsNull**: Checks if a field is null.
- **LessThan**, **LessThanOrEqual**: Compare for less-than conditions.
- **MoreThan**, **MoreThanOrEqual**: Compare for more-than conditions.
- **Not**: Negates a condition.

### Example: Using Operators

To query records with a field value less than a certain amount:

```typescript
const query = new GetRecords({
  filter: { amount: new LessThan(100) }
});
```


## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
