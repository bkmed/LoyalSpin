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

const normalizeServices = (items: Service[]): Service[] => {
  const seenIds = new Set<string>();
  return items.map((service, idx) => {
    let id = service.id;
    if (!id || seenIds.has(id)) {
      id = `srv-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000000)}`;
    }
    seenIds.add(id);
    return { ...service, id };
  });
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.items = normalizeServices(action.payload);
    },
    addService: (state, action: PayloadAction<Service>) => {
      const service = action.payload;
      const hasDuplicateId = state.items.some(item => item.id === service.id);
      const id =
        !service.id || hasDuplicateId
          ? `srv-${Date.now()}-${state.items.length}-${Math.floor(
              Math.random() * 1000000,
            )}`
          : service.id;
      state.items.push({ ...service, id });
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

export const selectServices = (state: { services?: ServicesState }) =>
  state.services?.items || [];

export default servicesSlice.reducer;
