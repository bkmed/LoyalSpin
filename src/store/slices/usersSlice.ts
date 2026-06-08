import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAccount } from '../../database/schema';

interface UsersState {
  items: UserAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [
    {
      id: 'super-1',
      name: 'Super Admin',
      email: 'super@demo.com',
      role: 'super-admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'admin-1',
      name: 'Admin Demo 1',
      email: 'admin1@demo.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-1',
      name: 'Client Demo 1',
      email: 'user1@demo.com',
      role: 'user',
      status: 'active',
      managerId: 'admin-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'admin-2',
      name: 'Admin Demo 2',
      email: 'admin2@demo.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user-2',
      name: 'Client Demo 2',
      email: 'user2@demo.com',
      role: 'user',
      status: 'active',
      managerId: 'admin-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserAccount[]>) => {
      state.items = action.payload;
    },
    addUser: (state, action: PayloadAction<UserAccount>) => {
      state.items.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserAccount>) => {
      const index = state.items.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(u => u.id !== action.payload);
    },
    updateUserRole: (
      state,
      action: PayloadAction<{ userId: string; role: string }>,
    ) => {
      const user = state.items.find(u => u.id === action.payload.userId);
      if (user) {
        user.role = action.payload.role;
        user.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { setUsers, addUser, updateUser, deleteUser, updateUserRole } =
  usersSlice.actions;

export const selectAllUsers = (state: { users: UsersState }) =>
  state.users.items;
export const selectUserById = (id: string) => (state: { users: UsersState }) =>
  state.users.items.find(u => u.id === id);

export default usersSlice.reducer;
