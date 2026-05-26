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

// Import slices
import authReducer from './slices/authSlice';
import announcementsReducer from './slices/announcementsSlice';
import notificationsReducer from './slices/notificationsSlice';
import messagesReducer from './slices/messagesSlice';
import currenciesReducer from './slices/currenciesSlice';
import analyticsReducer from './slices/analyticsSlice';
import usersReducer from './slices/usersSlice';
import walletReducer from './slices/walletSlice';
import goalsReducer from './slices/goalsSlice';
import categoriesReducer from './slices/categoriesSlice';
import servicesReducer from './slices/servicesSlice';
import partsReducer from './slices/partsSlice';
import loyalspinSettingsReducer from './slices/loyalspinSettingsSlice';
import galleryReducer from './slices/gallerySlice';
import uiReducer from './slices/uiSlice';
import webSessionReducer from './slices/webSessionSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  announcements: announcementsReducer,
  notifications: notificationsReducer,
  messages: messagesReducer,
  currencies: currenciesReducer,
  analytics: analyticsReducer,
  users: usersReducer,
  wallet: walletReducer,
  goals: goalsReducer,
  categories: categoriesReducer,
  services: servicesReducer,
  parts: partsReducer,
  gallery: galleryReducer,
  loyalspinSettings: loyalspinSettingsReducer,
  ui: uiReducer,
  webSession: webSessionReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: [
    'auth',
    'announcements',
    'notifications',
    'messages',
    'currencies',
    'analytics',
    'users',
    'wallet',
    'goals',
    'categories',
    'services',
    'parts',
    'gallery',
    'loyalspinSettings',
    'ui',
    'webSession',
  ], // add slices here to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
