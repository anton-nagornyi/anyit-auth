import { DateTime } from 'luxon';

export interface Password {
  id: number;
  passwordHash: string;
  resetToken: string | null;
  resetTokenExpiresAt: DateTime | null;
}
