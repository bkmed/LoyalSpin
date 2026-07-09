import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Reclamation, ReclamationStatus, Role } from '../../database/schema';
import { RootState } from '../index';
import { collection, doc, getDocs, query, setDoc, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export const fetchReclamations = createAsyncThunk(
  'reclamations/fetchAll',
  async ({ role, userId }: { role: Role; userId: string }) => {
    let q;
    if (role === 'super-admin') {
      // Superadmin sees all
      q = query(collection(db, 'reclamations'));
    } else {
      // Admin or User sees only their own
      q = query(collection(db, 'reclamations'), where('userId', '==', userId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Reclamation));
  }
);

export const createReclamation = createAsyncThunk(
  'reclamations/create',
  async (newReclamation: Reclamation) => {
    try {
      const ref = doc(db, 'reclamations', newReclamation.id);
      await setDoc(ref, newReclamation);
      return newReclamation;
    } catch (error) {
      console.error('Error creating reclamation:', error);
      throw error;
    }
  }
);

export const updateReclamationStatus = createAsyncThunk(
  'reclamations/updateStatus',
  async ({ id, status, adminResponse }: { id: string; status: ReclamationStatus; adminResponse?: string }) => {
    try {
      const ref = doc(db, 'reclamations', id);
      const updateData: any = { status, updatedAt: new Date().toISOString() };
      if (adminResponse !== undefined) {
        updateData.adminResponse = adminResponse;
      }
      await updateDoc(ref, updateData);
      return { id, status, adminResponse, updatedAt: updateData.updatedAt };
    } catch (error) {
      console.error('Error updating reclamation status:', error);
      throw error;
    }
  }
);

export const deleteReclamation = createAsyncThunk(
  'reclamations/delete',
  async (id: string) => {
    try {
      const ref = doc(db, 'reclamations', id);
      await deleteDoc(ref);
      return id;
    } catch (error) {
      console.error('Error deleting reclamation:', error);
      throw error;
    }
  }
);

interface ReclamationsState {
  items: Reclamation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReclamationsState = {
  items: [],
  loading: false,
  error: null,
};

const reclamationsSlice = createSlice({
  name: 'reclamations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReclamations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReclamations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReclamations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reclamations';
      })
      // Create
      .addCase(createReclamation.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateReclamationStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      // Delete
      .addCase(deleteReclamation.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default reclamationsSlice.reducer;
