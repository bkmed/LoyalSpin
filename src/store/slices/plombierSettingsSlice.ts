import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoyalSpinSettingsState {
  businessName: string;
  experienceYears: number;
  interventionZones: string[];
  supportEmail: string;
  supportPhone: string;
}

const initialState: LoyalSpinSettingsState = {
  businessName: 'LoyalSpin Tunisie',
  experienceYears: 15,
  interventionZones: ['Grand Tunis', 'Sahel', 'Sfax'],
  supportEmail: '',
  supportPhone: '',
};

const ensureInterventionZones = (state: LoyalSpinSettingsState) => {
  if (!Array.isArray(state.interventionZones)) {
    state.interventionZones = [];
  }
};

const loyalspinSettingsSlice = createSlice({
  name: 'loyalspinSettings',
  initialState,
  reducers: {
    updateLoyalSpinSettings: (
      state,
      action: PayloadAction<Partial<LoyalSpinSettingsState>>,
    ) => {
      if (action.payload.businessName !== undefined) {
        state.businessName = action.payload.businessName;
      }
      if (action.payload.experienceYears !== undefined) {
        state.experienceYears = action.payload.experienceYears;
      }
      if (action.payload.interventionZones !== undefined) {
        state.interventionZones = Array.isArray(
          action.payload.interventionZones,
        )
          ? action.payload.interventionZones
          : [];
      }
      if (action.payload.supportEmail !== undefined) {
        state.supportEmail = action.payload.supportEmail;
      }
      if (action.payload.supportPhone !== undefined) {
        state.supportPhone = action.payload.supportPhone;
      }
    },
    addInterventionZone: (state, action: PayloadAction<string>) => {
      ensureInterventionZones(state);
      const zone = action.payload.trim();
      if (zone && !state.interventionZones.includes(zone)) {
        state.interventionZones.push(zone);
      }
    },
    updateInterventionZone: (
      state,
      action: PayloadAction<{ index: number; name: string }>,
    ) => {
      ensureInterventionZones(state);
      const { index, name } = action.payload;
      const trimmedName = name.trim();
      if (
        trimmedName &&
        index >= 0 &&
        index < state.interventionZones.length &&
        !state.interventionZones.some(
          (zone, idx) => idx !== index && zone === trimmedName,
        )
      ) {
        state.interventionZones[index] = trimmedName;
      }
    },
    removeInterventionZone: (state, action: PayloadAction<number>) => {
      ensureInterventionZones(state);
      state.interventionZones = state.interventionZones.filter(
        (_, idx) => idx !== action.payload,
      );
    },
  },
});

export const {
  updateLoyalSpinSettings,
  addInterventionZone,
  updateInterventionZone,
  removeInterventionZone,
} = loyalspinSettingsSlice.actions;

export default loyalspinSettingsSlice.reducer;
