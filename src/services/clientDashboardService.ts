import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { ClientDashboardConfig } from '../database/schema';

const COLLECTION_NAME = 'clientDashboardConfigs';

export const clientDashboardService = {
  async getByProject(projectId: string): Promise<ClientDashboardConfig | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ClientDashboardConfig;
      }
      return null;
    } catch (error) {
      console.error('Error fetching client dashboard config:', error);
      return null;
    }
  },

  async save(config: ClientDashboardConfig): Promise<ClientDashboardConfig> {
    try {
      const configWithDates = {
        ...config,
        updatedAt: new Date().toISOString(),
        createdAt: config.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, COLLECTION_NAME, config.projectId), configWithDates);
      return configWithDates;
    } catch (error) {
      console.error('Error saving client dashboard config:', error);
      return config;
    }
  }
};
