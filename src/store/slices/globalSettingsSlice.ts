import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { GlobalSettings } from '../../database/schema';
import type { RootState } from '../index';

const DEFAULT_SETTINGS: GlobalSettings = {
  id: 'global',
  maxSpinsPerDay: 200,   // replaces hardcoded 200
  couponValidityDays: 30,
  sessionDurationMinutes: 60,
  defaultCurrency: 'EUR',
  defaultLanguage: 'fr',
  maintenanceMode: false,
  allowNewRegistrations: true,
  requireEmailVerification: true,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const fetchGlobalSettings = createAsyncThunk('globalSettings/fetch', async () => {
  const { globalSettingsService } = await import('../../services/globalSettingsService');
  return globalSettingsService.get();
});

export const saveGlobalSettings = createAsyncThunk(
  'globalSettings/save',
  async (settings: Partial<GlobalSettings>) => {
    const { globalSettingsService } = await import('../../services/globalSettingsService');
    return globalSettingsService.update(settings);
  },
);

interface GlobalSettingsState {
  settings: GlobalSettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: GlobalSettingsState = {
  settings: DEFAULT_SETTINGS,
  loading: false,
  saving: false,
  error: null,
};

const globalSettingsSlice = createSlice({
  name: 'globalSettings',
  initialState,
  reducers: {
    setLocalSettings(state, action: PayloadAction<Partial<GlobalSettings>>) {
      state.settings = { ...state.settings, ...action.payload };
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGlobalSettings.pending, state => { state.loading = true; })
      .addCase(fetchGlobalSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.settings = action.payload;
      })
      .addCase(fetchGlobalSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load global settings';
      });

    builder
      .addCase(saveGlobalSettings.pending, state => { state.saving = true; })
      .addCase(saveGlobalSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(saveGlobalSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? 'Failed to save global settings';
      });
  },
});

export const { setLocalSettings, clearError } = globalSettingsSlice.actions;

export const selectGlobalSettings = (state: RootState) => state.globalSettings.settings;
export const selectMaxSpinsPerDay = (state: RootState) =>
  state.globalSettings.settings.maxSpinsPerDay;
export const selectCouponValidityDays = (state: RootState) =>
  state.globalSettings.settings.couponValidityDays;
export const selectMaintenanceMode = (state: RootState) =>
  state.globalSettings.settings.maintenanceMode;

export default globalSettingsSlice.reducer;
