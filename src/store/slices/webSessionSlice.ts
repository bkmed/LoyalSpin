import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  WebSessionUser,
  Role,
} from '../../features/plombier/utils/webTranslations';

interface WebSessionState {
  sessionUser: WebSessionUser | null;
  currentRole: Role;
}

const initialState: WebSessionState = {
  sessionUser: null,
  currentRole: 'anonyme',
};

const webSessionSlice = createSlice({
  name: 'webSession',
  initialState,
  reducers: {
    setSessionUser: (state, action: PayloadAction<WebSessionUser | null>) => {
      state.sessionUser = action.payload;
    },
    setCurrentRole: (state, action: PayloadAction<Role>) => {
      state.currentRole = action.payload;
    },
    clearSession: state => {
      state.sessionUser = null;
      state.currentRole = 'anonyme';
    },
  },
});

export const { setSessionUser, setCurrentRole, clearSession } =
  webSessionSlice.actions;
export default webSessionSlice.reducer;
