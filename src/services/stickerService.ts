import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { StickerConfig } from '../database/schema';

const COLLECTION_NAME = 'stickerConfigs';

export const stickerService = {
  async getByProject(projectId: string): Promise<StickerConfig | null> {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as StickerConfig;
    }
    return null;
  },

  async save(config: StickerConfig): Promise<StickerConfig> {
    const configWithDates = {
      ...config,
      updatedAt: new Date().toISOString(),
      createdAt: config.createdAt || new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, config.projectId), configWithDates);
    console.log('✅ Sticker config saved in Firebase for project:', config.projectId);
    return configWithDates;
  }
};
