import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Coupon } from '../../database/schema';
import type { RootState } from '../index';

// ──────────────────────────────────────────────
// Thunks
// ──────────────────────────────────────────────
export const fetchCoupons = createAsyncThunk(
  'coupons/fetch',
  async (projectId: string) => {
    const { couponsService } = await import('../../services/couponsService');
    return couponsService.getByProject(projectId);
  },
);

export const createCoupon = createAsyncThunk(
  'coupons/create',
  async (data: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedQuantity'>) => {
    const { couponsService } = await import('../../services/couponsService');
    return couponsService.create(data);
  },
);

export const updateCoupon = createAsyncThunk(
  'coupons/update',
  async ({ id, data }: { id: string; data: Partial<Coupon> }) => {
    const { couponsService } = await import('../../services/couponsService');
    return couponsService.update(id, data);
  },
);

export const deleteCoupon = createAsyncThunk(
  'coupons/delete',
  async (id: string) => {
    const { couponsService } = await import('../../services/couponsService');
    await couponsService.remove(id);
    return id;
  },
);

export const toggleCouponActive = createAsyncThunk(
  'coupons/toggleActive',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    const { couponsService } = await import('../../services/couponsService');
    return couponsService.update(id, { isActive, updatedAt: new Date().toISOString() });
  },
);

// ──────────────────────────────────────────────
// State
// ──────────────────────────────────────────────
interface CouponsState {
  items: Coupon[];
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponsState = {
  items: [],
  selectedProjectId: null,
  loading: false,
  error: null,
};

// ──────────────────────────────────────────────
// Slice
// ──────────────────────────────────────────────
const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    setSelectedProjectId(state, action: PayloadAction<string>) {
      state.selectedProjectId = action.payload;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCoupons.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load coupons';
      });

    builder.addCase(createCoupon.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    const handleUpdate = (state: CouponsState, action: PayloadAction<Coupon>) => {
      const idx = state.items.findIndex(c => c.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    };
    builder
      .addCase(updateCoupon.fulfilled, handleUpdate)
      .addCase(toggleCouponActive.fulfilled, handleUpdate);

    builder.addCase(deleteCoupon.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    });
  },
});

export const { setSelectedProjectId, clearError } = couponsSlice.actions;

// Selectors
export const selectAllCoupons = (state: RootState) => state.coupons.items;
export const selectCouponsByProject = (projectId: string) => (state: RootState) =>
  state.coupons.items.filter(c => c.projectId === projectId);
export const selectActiveCoupons = (projectId: string) => (state: RootState) =>
  state.coupons.items.filter(c => c.projectId === projectId && c.isActive);
export const selectCouponsLoading = (state: RootState) => state.coupons.loading;

export default couponsSlice.reducer;
