import { UserAccount } from '../../../database/schema';

export type Role = 'anonyme' | 'user' | 'admin' | 'super-admin';

export type WebSessionUser = UserAccount & {
  city?: string;
};
