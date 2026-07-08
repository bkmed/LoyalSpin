import { Storage } from 'redux-persist';
import { storageService } from '../services/storage';

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storageService.setString(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storageService.getString(key);
    // redux-persist expects null (not undefined) when key is missing
    return Promise.resolve(value ?? null);
  },
  removeItem: key => {
    storageService.delete(key);
    return Promise.resolve();
  },
};

