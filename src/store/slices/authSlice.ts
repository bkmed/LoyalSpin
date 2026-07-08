import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAccount as User } from '../../database/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Changed from true to false so AppNavigator proceeds to Auth
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: state => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;
