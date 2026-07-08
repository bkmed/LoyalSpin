import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { SpinHistory } from '../../database/schema';
import type { RootState } from '../index';

export const fetchSpinHistory = createAsyncThunk(
  'spinHistory/fetch',
  async ({ projectId, userId }: { projectId: string; userId?: string }) => {
    const { spinService } = await import('../../services/spinService');
    return spinService.getHistory(projectId, userId);
  },
);

export const recordSpin = createAsyncThunk(
  'spinHistory/record',
  async (data: Omit<SpinHistory, 'id' | 'createdAt'>) => {
    const { spinService } = await import('../../services/spinService');
    return spinService.record(data);
  },
);

interface SpinHistoryState {
  items: SpinHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: SpinHistoryState = {
  items: [],
  loading: false,
  error: null,
};

const spinHistorySlice = createSlice({
  name: 'spinHistory',
  initialState,
  reducers: {
    clearHistory(state) { state.items = []; },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSpinHistory.pending, state => { state.loading = true; })
      .addCase(fetchSpinHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSpinHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load spin history';
      });

    builder.addCase(recordSpin.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
  },
});

export const { clearHistory, clearError } = spinHistorySlice.actions;

export const selectSpinHistory = (state: RootState) => state.spinHistory.items;
export const selectSpinsByProject = (projectId: string) => (state: RootState) =>
  state.spinHistory.items.filter(s => s.projectId === projectId);
export const selectSpinsByUser = (userId: string) => (state: RootState) =>
  state.spinHistory.items.filter(s => s.userId === userId);
export const selectSpinsTodayByUser = (userId: string, projectId: string) => (state: RootState) => {
  const today = new Date().toDateString();
  return state.spinHistory.items.filter(
    s => s.userId === userId && s.projectId === projectId &&
      new Date(s.spinDate).toDateString() === today,
  );
};

export default spinHistorySlice.reducer;
