import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../config/firebase'; 
import { Platform } from 'react-native';

let storage: any = null;
try {
  storage = getStorage(app);
} catch (err) {
  console.warn('Could not initialize Firebase Storage', err);
}

export const FirebaseStorageService = {
  uploadImageAsync: async (uri: string, path: string): Promise<string> => {
    if (!storage) {
      throw new Error('Firebase Storage is not initialized');
    }
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Firebase Storage upload error:', error);
      throw error;
    }
  }
};
