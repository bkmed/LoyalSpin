import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { GlobalSettings } from '../database/schema';

const COLLECTION_NAME = 'settings';
const DOC_ID = 'global';

export const globalSettingsService = {
  async get(): Promise<GlobalSettings | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as GlobalSettings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      return null;
    }
  },

  async update(settings: Partial<GlobalSettings>): Promise<GlobalSettings> {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOC_ID);
      const updatedData = { ...settings, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updatedData);
      
      const updatedDoc = await getDoc(docRef);
      return updatedDoc.data() as GlobalSettings;
    } catch (error) {
      console.error('Error updating global settings:', error);
      throw error;
    }
  }
};
