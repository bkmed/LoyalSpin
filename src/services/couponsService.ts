import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Coupon } from '../database/schema';

const COLLECTION_NAME = 'coupons';

export const couponsService = {
  async getByProject(projectId: string): Promise<Coupon[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  },

  async create(data: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'usedQuantity'>): Promise<Coupon> {
    const id = `coup_${Date.now()}`;
    const newCoupon: Coupon = {
      ...data,
      id,
      usedQuantity: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), newCoupon);
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
    return newCoupon;
  },

  async update(id: string, data: Partial<Coupon>): Promise<Coupon> {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updatedData);
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
    return { id, ...data } as Coupon; // In real app, fetch the updated doc
  },

  async remove(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  }
};
