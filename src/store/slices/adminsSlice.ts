import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserAccount } from '../../database/schema';
import { RootState } from '../index';

export const fetchAdmins = createAsyncThunk(
  'admins/fetchAll',
  async () => {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('../../services/firebaseConfig');
    
    const q = query(
      collection(db, 'users'), 
      where('role', '==', 'admin')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAccount));
  }
);

interface AdminsState {
  items: UserAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminsState = {
  items: [],
  loading: false,
  error: null,
};

const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    addAdmin: (state, action: PayloadAction<UserAccount>) => {
      state.items.push(action.payload);
    },
    updateAdmin: (state, action: PayloadAction<UserAccount>) => {
      const index = state.items.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteAdmin: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(u => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch admins';
      });
  }
});

export const { addAdmin, updateAdmin, deleteAdmin } = adminsSlice.actions;

export const selectAllAdmins = (state: RootState) => state.admins?.items || [];
export const selectAdminById = (id: string) => (state: RootState) =>
  state.admins?.items?.find(u => u.id === id);
export const selectAdminsLoading = (state: RootState) => state.admins?.loading;

export default adminsSlice.reducer;
