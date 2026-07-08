import { collection, doc, getDocs, setDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { SpinHistory } from '../database/schema';

const COLLECTION_NAME = 'spinHistory';

export const spinService = {
  async getHistory(projectId: string, userId?: string): Promise<SpinHistory[]> {
    try {
      let q = query(collection(db, COLLECTION_NAME), where('projectId', '==', projectId));
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as SpinHistory))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching spin history:', error);
      return [];
    }
  },

  async record(data: Omit<SpinHistory, 'id' | 'createdAt'>): Promise<SpinHistory> {
    const id = `spin_${Date.now()}`;
    const newSpin: SpinHistory = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), newSpin);
    } catch (error) {
      console.error('Error recording spin:', error);
    }
    return newSpin;
  }
};
