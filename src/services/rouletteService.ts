import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { RouletteConfig } from '../database/schema';

const COLLECTION_NAME = 'rouletteConfigs';

export const rouletteService = {
  async getByProject(projectId: string): Promise<RouletteConfig | null> {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as RouletteConfig;
    }
    return null;
  },

  async save(config: RouletteConfig): Promise<RouletteConfig> {
    const configWithDates = {
      ...config,
      updatedAt: new Date().toISOString(),
      createdAt: config.createdAt || new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, config.projectId), configWithDates);
    console.log('✅ Roulette config saved in Firebase for project:', config.projectId);
    return configWithDates;
  },

  async toggleActive(projectId: string, isActive: boolean): Promise<RouletteConfig | null> {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Roulette active toggled in Firebase:', projectId, isActive);
    return await this.getByProject(projectId);
  }
};
