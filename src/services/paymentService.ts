import { collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Payment } from '../database/schema';

const COLLECTION_NAME = 'payments';

export const paymentService = {
  async getByProject(projectId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('projectId', '==', projectId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Payment))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const id = `pay_${Date.now()}`;
    const newPayment: Payment = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), newPayment);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
    return newPayment;
  },

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updatedData);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
    return { id, ...data } as Payment; // Should fetch updated document ideally
  }
};
