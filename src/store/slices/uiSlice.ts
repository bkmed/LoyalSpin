import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LanguageCode = 'FR' | 'AR' | 'EN';

type ThemeMode = 'light' | 'dark';

interface UIState {
  currentLang: LanguageCode;
  currentTheme: ThemeMode;
  activeTab: string;
  bypassAuth: boolean;
}

const initialState: UIState = {
  currentLang: 'FR',
  currentTheme: 'light',
  activeTab: 'Accueil',
  bypassAuth: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentLang: (state, action: PayloadAction<LanguageCode>) => {
      state.currentLang = action.payload;
    },
    setCurrentTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.currentTheme = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setBypassAuth: (state, action: PayloadAction<boolean>) => {
      state.bypassAuth = action.payload;
    },
  },
});

export const { setCurrentLang, setCurrentTheme, setActiveTab, setBypassAuth } =
  uiSlice.actions;
export default uiSlice.reducer;
