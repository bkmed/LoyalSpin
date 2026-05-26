import { User } from './authService';

export type WalletRole = 'user' | 'premium' | 'admin' | 'guest';

export enum Permission {
  VIEW_WALLET = 'view_wallet',
  MANAGE_WALLET = 'manage_wallet',
  VIEW_REPORTS = 'view_reports',
  MANAGE_SETTINGS = 'manage_settings',
}

const walletRoutes = [
  'Home',
  'History',
  'Reports',
  'Accounts',
  'Goals',
  'Profile',
];

class RbacService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasPermission(_user: User | null, _permission: Permission): boolean {
    return true;
  }

  canAccessRoute(_user: User | null, route: string): boolean {
    return walletRoutes.includes(route);
  }

  getUserRole(user: User | null): WalletRole {
    if (!user) return 'guest';
    if (user.role === 'admin') return 'admin';
    return 'user';
  }

  isAdmin(user: User | null): boolean {
    return this.getUserRole(user) === 'admin';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isStockManager(_user: User | null): boolean {
    return false;
  }

  isUser(user: User | null): boolean {
    return this.getUserRole(user) === 'user';
  }

  isAnonyme(user: User | null): boolean {
    return !user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canManageCatalog(_user: User | null): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canViewAnalytics(_user: User | null): boolean {
    return true;
  }
}

export const rbacService = new RbacService();
