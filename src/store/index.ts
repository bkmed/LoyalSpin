import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { reduxStorage } from './storage';

// ── Core Slices ──
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice';
import analyticsReducer from './slices/analyticsSlice';
import uiReducer from './slices/uiSlice';
import webSessionReducer from './slices/webSessionSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import appSettingsReducer from './slices/appSettingsSlice';

// ── LoyalSpin Domain Slices ──
import usersReducer from './slices/usersSlice';
import adminsReducer from './slices/adminsSlice';
import projectsReducer from './slices/projectsSlice';
import rouletteConfigReducer from './slices/rouletteConfigSlice';
import stickerConfigReducer from './slices/stickerConfigSlice';
import couponsReducer from './slices/couponsSlice';
import spinHistoryReducer from './slices/spinHistorySlice';
import clientDashboardReducer from './slices/clientDashboardSlice';
import globalSettingsReducer from './slices/globalSettingsSlice';
import reclamationsReducer from './slices/reclamationsSlice';

const rootReducer = combineReducers({
  // Core
  auth: authReducer,
  notifications: notificationsReducer,
  analytics: analyticsReducer,
  ui: uiReducer,
  webSession: webSessionReducer,
  subscription: subscriptionReducer,
  appSettings: appSettingsReducer,

  // LoyalSpin Domain
  users: usersReducer,
  admins: adminsReducer,
  projects: projectsReducer,
  rouletteConfig: rouletteConfigReducer,
  stickerConfig: stickerConfigReducer,
  coupons: couponsReducer,
  spinHistory: spinHistoryReducer,
  clientDashboard: clientDashboardReducer,
  globalSettings: globalSettingsReducer,
  reclamations: reclamationsReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: [
    'auth',
    'notifications',
    'analytics',
    'users',
    'admins',
    'projects',
    'rouletteConfig',
    'stickerConfig',
    'coupons',
    'spinHistory',
    'clientDashboard',
    'globalSettings',
    'subscription',
    'appSettings',
    'ui',
    'webSession',
    'reclamations',
  ],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
