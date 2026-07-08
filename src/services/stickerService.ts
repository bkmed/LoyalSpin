import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { StickerConfig } from '../database/schema';

const COLLECTION_NAME = 'stickerConfigs';

export const stickerService = {
  async getByProject(projectId: string): Promise<StickerConfig | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as StickerConfig;
      }
      return null;
    } catch (error) {
      console.error('Error fetching sticker config:', error);
      return null;
    }
  },

  async save(config: StickerConfig): Promise<StickerConfig> {
    try {
      const configWithDates = {
        ...config,
        updatedAt: new Date().toISOString(),
        createdAt: config.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, COLLECTION_NAME, config.projectId), configWithDates);
      return configWithDates;
    } catch (error) {
      console.error('Error saving sticker config:', error);
      return config;
    }
  }
};
