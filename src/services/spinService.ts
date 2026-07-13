import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { SpinHistory } from '../database/schema';

const COLLECTION_NAME = 'spinHistory';

export const spinService = {
  async getHistory(projectId: string, userId?: string): Promise<SpinHistory[]> {
    let q = query(collection(db, COLLECTION_NAME), where('projectId', '==', projectId));
    if (userId) {
      q = query(q, where('userId', '==', userId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as SpinHistory))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async record(data: Omit<SpinHistory, 'id' | 'createdAt'>): Promise<SpinHistory> {
    const id = `spin_${Date.now()}`;
    const newSpin: SpinHistory = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, id), newSpin);
    console.log('✅ Spin recorded in Firebase:', id);
    return newSpin;
  }
};
