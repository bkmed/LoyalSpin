import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ClientDashboardConfig } from '../../database/schema';
import type { RootState } from '../index';

export const fetchClientDashboard = createAsyncThunk(
  'clientDashboard/fetch',
  async (projectId: string) => {
    const { clientDashboardService } = await import('../../services/clientDashboardService');
    return clientDashboardService.getByProject(projectId);
  },
);

export const saveClientDashboard = createAsyncThunk(
  'clientDashboard/save',
  async (config: ClientDashboardConfig) => {
    const { clientDashboardService } = await import('../../services/clientDashboardService');
    return clientDashboardService.save(config);
  },
);

interface ClientDashboardState {
  configs: Record<string, ClientDashboardConfig>;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: ClientDashboardState = {
  configs: {},
  loading: false,
  saving: false,
  error: null,
};

const clientDashboardSlice = createSlice({
  name: 'clientDashboard',
  initialState,
  reducers: {
    setLocalDashboard(state, action: PayloadAction<ClientDashboardConfig>) {
      state.configs[action.payload.projectId] = action.payload;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchClientDashboard.pending, state => { state.loading = true; })
      .addCase(fetchClientDashboard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.configs[action.payload.projectId] = action.payload;
      })
      .addCase(fetchClientDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load dashboard config';
      });

    builder
      .addCase(saveClientDashboard.pending, state => { state.saving = true; })
      .addCase(saveClientDashboard.fulfilled, (state, action) => {
        state.saving = false;
        state.configs[action.payload.projectId] = action.payload;
      })
      .addCase(saveClientDashboard.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? 'Failed to save dashboard config';
      });
  },
});

export const { setLocalDashboard, clearError } = clientDashboardSlice.actions;

export const selectClientDashboard = (projectId: string) => (state: RootState) =>
  state.clientDashboard.configs[projectId] ?? null;
export const selectClientDashboardLoading = (state: RootState) => state.clientDashboard.loading;
export const selectClientDashboardSaving = (state: RootState) => state.clientDashboard.saving;

export default clientDashboardSlice.reducer;
