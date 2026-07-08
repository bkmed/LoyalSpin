import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Project } from '../database/schema';

const COLLECTION_NAME = 'projects';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Return empty array for now as fallback while Firestore is unconfigured
      return [];
    }
  },

  async getById(id: string): Promise<Project | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
      }
      return null;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `proj_${Date.now()}`;
    const newProject: Project = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), newProject);
    } catch (error) {
      console.error('Error creating project:', error);
    }
    return newProject;
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error('Error updating project:', error);
    }
    // Return mock updated for now
    const proj = await this.getById(id);
    return proj as Project;
  },

  async remove(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
};
