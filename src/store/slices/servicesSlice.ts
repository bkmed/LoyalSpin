import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Service {
  id: string;
  name: string;
  icon: string;
  desc?: string;
  pts?: string[];
  whatsappText?: string;
  imgBefore?: string;
  imgAfter?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ServicesState {
  items: Service[];
}

const initialState: ServicesState = { items: [] };

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.items = action.payload;
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.items.push(action.payload);
    },
    updateService: (state, action: PayloadAction<Service>) => {
      const idx = state.items.findIndex(s => s.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(s => s.id !== action.payload);
    },
  },
});

export const { setServices, addService, updateService, deleteService } =
  servicesSlice.actions;

export const selectServices = (state: { services: ServicesState }) =>
  state.services.items;

export default servicesSlice.reducer;
