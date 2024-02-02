# @anyit/store-in-memory-actor Library

This library provides the `StoreInMemoryActor` class for handling in-memory store operations in an actor-based system.
It utilizes `@anyit/store-dto` for defining the operations such as creating, deleting, and updating records, as well as
retrieving single or multiple records.

## Installation

To install the library, run:

```shell
yarn add @anyit/store-in-memory-actor
```

## Usage

The `StoreInMemoryActor` class provides in-memory CRUD operations:

### Creating a Record

To create a new record, the `CreateRecord` message is used.

### Deleting a Record

To delete a record, the `DeleteRecord` message is used with a specified filter.

### Getting a Record

To retrieve a single record, the `GetRecord` message is used with a specified filter.

### Getting Multiple Records

To retrieve multiple records, the `GetRecords` message is used with a specified filter.

### Updating a Record

To update an existing record, the `UpdateRecord` message is used with the record's new data.

## Contributing

Contributions are welcome. Please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
