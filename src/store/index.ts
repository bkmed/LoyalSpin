import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { reduxStorage } from './storage';
import { Service } from './slices/servicesSlice';

const normalizePersistedServices = createTransform(
  (inboundState: { items: Service[] }) => {
    if (!inboundState?.items) return inboundState;
    const seenIds = new Set<string>();
    return {
      items: inboundState.items.map((service, idx) => {
        let id = service.id;
        if (!id || seenIds.has(id)) {
          id = `srv-${Date.now()}-${idx}-${Math.floor(
            Math.random() * 1000000,
          )}`;
        }
        seenIds.add(id);
        return { ...service, id };
      }),
    };
  },
  state => state,
  { whitelist: ['services'] },
);

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
import plombierSettingsReducer from './slices/plombierSettingsSlice';
import galleryReducer from './slices/gallerySlice';
import uiReducer from './slices/uiSlice';
import webSessionReducer from './slices/webSessionSlice';
import loyalReducer from './slices/loyalSpinSlice';
import subscriptionReducer from './slices/subscriptionSlice';

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
  loyal: loyalReducer,
  subscription: subscriptionReducer,
  plombierSettings: plombierSettingsReducer,
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
    'loyal',
    'subscription',
    'gallery',
    'plombierSettings',
    'ui',
    'webSession',
  ], // add slices here to persist
  transforms: [normalizePersistedServices],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer as any,
) as typeof rootReducer;

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
