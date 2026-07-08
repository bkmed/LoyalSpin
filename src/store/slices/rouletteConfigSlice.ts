import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RouletteConfig, RouletteSegment } from '../../database/schema';
import type { RootState } from '../index';

// ──────────────────────────────────────────────
// Thunks
// ──────────────────────────────────────────────
export const fetchRouletteConfig = createAsyncThunk(
  'rouletteConfig/fetch',
  async (projectId: string) => {
    const { rouletteService } = await import('../../services/rouletteService');
    return rouletteService.getByProject(projectId);
  },
);

export const saveRouletteConfig = createAsyncThunk(
  'rouletteConfig/save',
  async (config: RouletteConfig) => {
    const { rouletteService } = await import('../../services/rouletteService');
    return rouletteService.save(config);
  },
);

export const toggleRouletteActive = createAsyncThunk(
  'rouletteConfig/toggleActive',
  async ({ projectId, isActive }: { projectId: string; isActive: boolean }) => {
    const { rouletteService } = await import('../../services/rouletteService');
    return rouletteService.toggleActive(projectId, isActive);
  },
);

// ──────────────────────────────────────────────
// State
// ──────────────────────────────────────────────
interface RouletteConfigState {
  configs: Record<string, RouletteConfig>; // keyed by projectId
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: RouletteConfigState = {
  configs: {},
  loading: false,
  saving: false,
  error: null,
};

// ──────────────────────────────────────────────
// Slice
// ──────────────────────────────────────────────
const rouletteConfigSlice = createSlice({
  name: 'rouletteConfig',
  initialState,
  reducers: {
    // Local mutations before saving
    setSegmentProbability(
      state,
      action: PayloadAction<{ projectId: string; segmentId: string; probability: number }>,
    ) {
      const cfg = state.configs[action.payload.projectId];
      if (cfg) {
        const seg = cfg.segments.find(s => s.id === action.payload.segmentId);
        if (seg) seg.probability = action.payload.probability;
      }
    },
    addSegment(state, action: PayloadAction<{ projectId: string; segment: RouletteSegment }>) {
      const cfg = state.configs[action.payload.projectId];
      if (cfg) cfg.segments.push(action.payload.segment);
    },
    removeSegment(state, action: PayloadAction<{ projectId: string; segmentId: string }>) {
      const cfg = state.configs[action.payload.projectId];
      if (cfg) {
        cfg.segments = cfg.segments.filter(s => s.id !== action.payload.segmentId);
      }
    },
    updateSegment(
      state,
      action: PayloadAction<{ projectId: string; segment: Partial<RouletteSegment> & { id: string } }>,
    ) {
      const cfg = state.configs[action.payload.projectId];
      if (cfg) {
        const idx = cfg.segments.findIndex(s => s.id === action.payload.segment.id);
        if (idx >= 0) cfg.segments[idx] = { ...cfg.segments[idx], ...action.payload.segment };
      }
    },
    setLocalConfig(state, action: PayloadAction<RouletteConfig>) {
      state.configs[action.payload.projectId] = action.payload;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRouletteConfig.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchRouletteConfig.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.configs[action.payload.projectId] = action.payload;
        }
      })
      .addCase(fetchRouletteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load roulette config';
      });

    builder
      .addCase(saveRouletteConfig.pending, state => { state.saving = true; })
      .addCase(saveRouletteConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.configs[action.payload.projectId] = action.payload;
      })
      .addCase(saveRouletteConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? 'Failed to save roulette config';
      });

    builder.addCase(toggleRouletteActive.fulfilled, (state, action) => {
      if (action.payload) {
        state.configs[action.payload.projectId] = action.payload;
      }
    });
  },
});

export const {
  setSegmentProbability,
  addSegment,
  removeSegment,
  updateSegment,
  setLocalConfig,
  clearError,
} = rouletteConfigSlice.actions;

// Selectors
export const selectRouletteConfig = (projectId: string) => (state: RootState) =>
  state.rouletteConfig.configs[projectId] ?? null;
export const selectRouletteLoading = (state: RootState) => state.rouletteConfig.loading;
export const selectRouletteSaving = (state: RootState) => state.rouletteConfig.saving;

export default rouletteConfigSlice.reducer;
