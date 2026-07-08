import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { StickerConfig } from '../../database/schema';
import type { RootState } from '../index';

export const fetchStickerConfig = createAsyncThunk(
  'stickerConfig/fetch',
  async (projectId: string) => {
    const { stickerService } = await import('../../services/stickerService');
    return stickerService.getByProject(projectId);
  },
);

export const saveStickerConfig = createAsyncThunk(
  'stickerConfig/save',
  async (config: StickerConfig) => {
    const { stickerService } = await import('../../services/stickerService');
    return stickerService.save(config);
  },
);

interface StickerConfigState {
  configs: Record<string, StickerConfig>; // keyed by projectId
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: StickerConfigState = {
  configs: {},
  loading: false,
  saving: false,
  error: null,
};

const stickerConfigSlice = createSlice({
  name: 'stickerConfig',
  initialState,
  reducers: {
    setLocalStickerConfig(state, action: PayloadAction<StickerConfig>) {
      state.configs[action.payload.projectId] = action.payload;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStickerConfig.pending, state => { state.loading = true; })
      .addCase(fetchStickerConfig.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.configs[action.payload.projectId] = action.payload;
      })
      .addCase(fetchStickerConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load sticker config';
      });

    builder
      .addCase(saveStickerConfig.pending, state => { state.saving = true; })
      .addCase(saveStickerConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.configs[action.payload.projectId] = action.payload;
      })
      .addCase(saveStickerConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? 'Failed to save sticker config';
      });
  },
});

export const { setLocalStickerConfig, clearError } = stickerConfigSlice.actions;

export const selectStickerConfig = (projectId: string) => (state: RootState) =>
  state.stickerConfig.configs[projectId] ?? null;
export const selectStickerLoading = (state: RootState) => state.stickerConfig.loading;
export const selectStickerSaving = (state: RootState) => state.stickerConfig.saving;

export default stickerConfigSlice.reducer;
