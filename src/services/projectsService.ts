import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Project } from '../database/schema';

const COLLECTION_NAME = 'projects';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
  },

  async getById(id: string): Promise<Project | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  },

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `proj_${Date.now()}`;
    const newProject: Project = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, id), newProject);
    console.log('✅ Project created in Firebase:', id);
    return newProject;
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedData);
    console.log('✅ Project updated in Firebase:', id);
    const proj = await this.getById(id);
    if (!proj) throw new Error(`Project ${id} not found after update`);
    return proj;
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('✅ Project deleted from Firebase:', id);
  }
};
