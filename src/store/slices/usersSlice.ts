import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserAccount, Role } from '../../database/schema';
import { RootState } from '../index';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export const fetchUsersByProject = createAsyncThunk(
  'users/fetchByProject',
  async (projectId: string) => {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('../../services/firebaseConfig');
    
    const q = query(
      collection(db, 'users'), 
      where('projectId', '==', projectId),
      where('role', '==', 'user')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAccount));
  }
);

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async () => {
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('../../services/firebaseConfig');
    
    const q = query(
      collection(db, 'users'), 
      where('role', '==', 'user')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAccount));
  }
);

export const saveNewUser = createAsyncThunk(
  'users/saveNewUser',
  async (newUser: UserAccount) => {
    try {
      const userRef = doc(db, 'users', newUser.id);
      await setDoc(userRef, newUser);
      return newUser;
    } catch (error) {
      console.error('Error saving new user to Firestore:', error);
      throw error;
    }
  }
);

export const updateUserInFirebase = createAsyncThunk(
  'users/updateInFirebase',
  async (updatedUser: UserAccount) => {
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      const userToSave = {
        ...updatedUser,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(userRef, userToSave as any);
      return userToSave as UserAccount;
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }
);

export const deleteUserFromFirebase = createAsyncThunk(
  'users/deleteFromFirebase',
  async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return userId;
    } catch (error) {
      console.error('Error deleting user from Firestore:', error);
      throw error;
    }
  }
);

interface UsersState {
  items: UserAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
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
      action: PayloadAction<{ userId: string; role: Role }>,
    ) => {
      const user = state.items.find(u => u.id === action.payload.userId);
      if (user) {
        user.role = action.payload.role;
        user.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersByProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsersByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsersByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(saveNewUser.pending, (state) => { state.loading = true; })
      .addCase(saveNewUser.fulfilled, (state, action) => {
        state.loading = false;
        // Check if user already exists
        const index = state.items.findIndex(u => u.id === action.payload.id);
        if (index === -1) {
          state.items.push(action.payload);
        }
      })
      .addCase(saveNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      .addCase(updateUserInFirebase.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUserInFirebase.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUserInFirebase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(deleteUserFromFirebase.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteUserFromFirebase.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUserFromFirebase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete user';
      });
  }
});

export const { setUsers, addUser, updateUser, deleteUser, updateUserRole } =
  usersSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.items;
export const selectUserById = (id: string) => (state: RootState) =>
  state.users.items.find(u => u.id === id);
export const selectUsersByProject = (projectId: string) => (state: RootState) =>
  state.users.items.filter(u => u.projectId === projectId);
export const selectUsersLoading = (state: RootState) => state.users.loading;

export default usersSlice.reducer;
