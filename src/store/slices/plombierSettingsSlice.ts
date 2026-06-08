import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlombierSettingsState {
  businessName: string;
  businessNameAr: string;
  experienceYears: number;
  interventionZones: string[];
  supportEmail: string;
  supportPhone: string;
  dispoVal?: string;
  govVal?: string;
}

const initialState: PlombierSettingsState = {
  businessName: 'Plombier Tunisie',
  businessNameAr: 'سباك تونس',
  experienceYears: 15,
  interventionZones: ['Grand Tunis', 'Sahel', 'Sfax'],
  supportEmail: '',
  supportPhone: '',
  dispoVal: '24/7',
  govVal: '24',
};

const ensureInterventionZones = (state: PlombierSettingsState) => {
  if (!Array.isArray(state.interventionZones)) {
    state.interventionZones = [];
  }
};

const plombierSettingsSlice = createSlice({
  name: 'plombierSettings',
  initialState,
  reducers: {
    updatePlombierSettings: (
      state,
      action: PayloadAction<Partial<PlombierSettingsState>>,
    ) => {
      if (action.payload.businessName !== undefined) {
        state.businessName = action.payload.businessName;
      }
      if (action.payload.businessNameAr !== undefined) {
        state.businessNameAr = action.payload.businessNameAr;
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
      if (action.payload.dispoVal !== undefined) {
        state.dispoVal = action.payload.dispoVal;
      }
      if (action.payload.govVal !== undefined) {
        state.govVal = action.payload.govVal;
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
  updatePlombierSettings,
  addInterventionZone,
  updateInterventionZone,
  removeInterventionZone,
} = plombierSettingsSlice.actions;

export default plombierSettingsSlice.reducer;
