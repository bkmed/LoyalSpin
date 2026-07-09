import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Coupon } from '../database/schema';

const COLLECTION_NAME = 'coupons';

export const couponsService = {
  async getByProject(projectId: string): Promise<Coupon[]> {
    const q = query(collection(db, COLLECTION_NAME), where('projectId', '==', projectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
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
    await setDoc(doc(db, COLLECTION_NAME, id), newCoupon);
    console.log('✅ Coupon created in Firebase:', id);
    return newCoupon;
  },

  async update(id: string, data: Partial<Coupon>): Promise<Coupon> {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(doc(db, COLLECTION_NAME, id), updatedData);
    console.log('✅ Coupon updated in Firebase:', id);
    return { id, ...updatedData } as Coupon;
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('✅ Coupon deleted from Firebase:', id);
  }
};
