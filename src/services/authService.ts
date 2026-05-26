import { storageService } from './storage';
import { UserAccount } from '../database/schema';

const AUTH_KEY = 'auth_session';
const USERS_KEY = 'auth_users';
const SEED_KEY = 'demo_data_seeded_wallet_v1';

export type UserRole = 'admin' | 'user' | 'anonyme';
export const ROLES: UserRole[] = ['admin', 'user', 'anonyme'];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUri?: string;
  phone?: string;
  addresses?: string[];
  preferredCurrency?: string;
  status?: 'active' | 'pending' | 'rejected';
  notificationPreferences?: {
    push: boolean;
    email: boolean;
  };
}

const seedDemoData = async () => {
  const users: Array<UserAccount & { password: string }> = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserAccount & { password: string },
    {
      id: 'user-1',
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'user123',
      role: 'user',
      status: 'active',
      preferredCurrency: 'DT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserAccount & { password: string },
  ];

  storageService.setString(USERS_KEY, JSON.stringify(users));
  storageService.setBoolean(SEED_KEY, true);
};

const toSessionUser = (user: UserAccount & { password?: string }): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as UserRole,
  avatarUri: user.avatarUri,
  addresses: user.addresses,
  preferredCurrency: user.preferredCurrency,
  status: user.status,
  notificationPreferences: {
    push: true,
    email: true,
  },
});

export const authService = {
  login: async (emailInput: string, password: string): Promise<User> => {
    const email = emailInput.trim().toLowerCase();
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!storageService.getBoolean(SEED_KEY)) {
      await seedDemoData();
    }

    const usersJson = storageService.getString(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];
    const user = users.find(
      (item: UserAccount & { password?: string }) =>
        item.email === email && item.password === password,
    );

    if (!user) throw new Error('Invalid credentials');

    const sessionUser = toSessionUser(user);
    storageService.setString(AUTH_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  register: async (
    name: string,
    emailInput: string,
    password: string,
    role: UserRole = 'user',
  ): Promise<User> => {
    const email = emailInput.trim().toLowerCase();
    await new Promise(resolve => setTimeout(resolve, 400));

    const usersJson = storageService.getString(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];
    if (
      users.find(
        (item: UserAccount & { password?: string }) => item.email === email,
      )
    ) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      status: 'active',
      preferredCurrency: 'DT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    storageService.setString(USERS_KEY, JSON.stringify(users));

    const sessionUser = toSessionUser(
      newUser as UserAccount & { password?: string },
    );
    storageService.setString(AUTH_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  updateUser: async (updatedData: Partial<User>): Promise<User> => {
    const currentJson = storageService.getString(AUTH_KEY);
    if (!currentJson) throw new Error('Not logged in');

    const currentUser = JSON.parse(currentJson);
    const newUser = { ...currentUser, ...updatedData };
    storageService.setString(AUTH_KEY, JSON.stringify(newUser));

    const usersJson = storageService.getString(USERS_KEY);
    if (usersJson) {
      const users = JSON.parse(usersJson);
      const index = users.findIndex(
        (item: UserAccount & { password?: string }) => item.id === newUser.id,
      );
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
        storageService.setString(USERS_KEY, JSON.stringify(users));
      }
    }

    return newUser;
  },

  logout: async (): Promise<void> => {
    storageService.delete(AUTH_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    const json = storageService.getString(AUTH_KEY);
    return json ? JSON.parse(json) : null;
  },
};
