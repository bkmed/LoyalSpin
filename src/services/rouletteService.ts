import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { RouletteConfig } from '../database/schema';

const COLLECTION_NAME = 'rouletteConfigs';

export const rouletteService = {
  async getByProject(projectId: string): Promise<RouletteConfig | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as RouletteConfig;
      }
      return null;
    } catch (error) {
      console.error('Error fetching roulette config:', error);
      return null;
    }
  },

  async save(config: RouletteConfig): Promise<RouletteConfig> {
    try {
      const configWithDates = {
        ...config,
        updatedAt: new Date().toISOString(),
        createdAt: config.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, COLLECTION_NAME, config.projectId), configWithDates);
      return configWithDates;
    } catch (error) {
      console.error('Error saving roulette config:', error);
      return config;
    }
  },

  async toggleActive(projectId: string, isActive: boolean): Promise<RouletteConfig | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, projectId);
      await updateDoc(docRef, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
      return await this.getByProject(projectId);
    } catch (error) {
      console.error('Error toggling roulette active:', error);
      return null;
    }
  }
};
