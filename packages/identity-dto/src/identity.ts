import { DateTime } from 'luxon';

export interface Identity {
  id: number;
  createdAt: DateTime;
  lastLoginAt: DateTime | null;
  lastSeenAt: DateTime | null;
  lastModifiedAt: DateTime;
  isActive: boolean;
  isLockedOut: boolean;
  lockOutEndsAt: DateTime | null;
  lastIPAddress: string | null;
}
