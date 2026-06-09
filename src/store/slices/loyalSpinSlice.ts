import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { submitPrizeClaim } from '../../services/loyalSpinService';

interface LoyalState {
  claimed: { prize: string; claimedAt: string }[];
  loading: boolean;
  error?: string | null;
}

const initialState: LoyalState = { claimed: [], loading: false, error: null };

export const claimPrize = createAsyncThunk(
  'loyal/claimPrize',
  async (payload: { prize: string }, thunkAPI) => {
    const res = await submitPrizeClaim({ prize: payload.prize });
    if (!res.ok) return thunkAPI.rejectWithValue('failed');
    return { prize: payload.prize };
  },
);

const loyalSlice = createSlice({
  name: 'loyal',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(claimPrize.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      claimPrize.fulfilled,
      (state, action: PayloadAction<{ prize: string }>) => {
        state.loading = false;
        state.claimed.push({
          prize: action.payload.prize,
          claimedAt: new Date().toISOString(),
        });
      },
    );
    builder.addCase(claimPrize.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || 'error';
    });
  },
});

export default loyalSlice.reducer;
