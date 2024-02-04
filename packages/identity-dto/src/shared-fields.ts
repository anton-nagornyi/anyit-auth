import { AuthDataField } from '@anyit/auth-actor-dto';

export const SharedFields: AuthDataField[] = [
  {
    name: 'createdAt',
    type: 'datetime',
    isNullable: false,
  },
  {
    name: 'lastLoginAt',
    type: 'datetime',
    isNullable: true,
  },
  {
    name: 'lastSeenAt',
    type: 'datetime',
    isNullable: true,
  },
  {
    name: 'lastModifiedAt',
    type: 'datetime',
    isNullable: false,
  },
  {
    name: 'isActive',
    type: 'boolean',
    isNullable: false,
  },
  {
    name: 'isLockedOut',
    type: 'boolean',
    isNullable: false,
  },
  {
    name: 'lockOutEndsAt',
    type: 'datetime',
    isNullable: true,
  },
  {
    name: 'lastIPAddress',
    type: 'string',
    isNullable: true,
  },
];
