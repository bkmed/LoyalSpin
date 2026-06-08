import { Category, UserAccount as User } from '../../../database/schema';

export type Role = 'anonyme' | 'user' | 'admin' | 'super-admin';

export type WebSessionUser = User & {
  city?: string;
};

export type LocalCategory = Category;
