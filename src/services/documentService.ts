
'use client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { DocumentReport } from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined): string => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
}

const documentsCollection = collection(db, 'documents');

export const documentService = {
  async getDocuments(filters?: {
    documentType?: string;
    location?: string;
    status?: string;
  }): Promise<DocumentReport[]> {
    let q = query(documentsCollection);

    if (filters?.documentType && filters.documentType !== 'all') {
      q = query(q, where('documentType', '==', filters.documentType));
    }
    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.location) {
        q = query(q, where('location', '>=', filters.location), where('location', '<=', filters.location + '\uf8ff'));
    }

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateLost: fromTimestamp(doc.data().dateLost as Timestamp),
        reportDate: fromTimestamp(doc.data().reportDate as Timestamp),
      })) as DocumentReport[];
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  },

  async getDocumentById(id: string): Promise<DocumentReport | null> {
    try {
      const docRef = doc(db, 'documents', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          dateLost: fromTimestamp(data.dateLost as Timestamp),
          reportDate: fromTimestamp(data.reportDate as Timestamp),
        } as DocumentReport;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      return null;
    }
  },

  async addDocument(
    documentData: Omit<DocumentReport, 'id' | 'reportDate' | 'reportedBy'> & { file?: any }, 
    userId: string
  ): Promise<void> {
    let imageUrl: string | undefined = undefined;
    if (documentData.file) {
        const fileRef = ref(storage, `documents/${userId}/${documentData.file.name}`);
        const snapshot = await uploadBytes(fileRef, documentData.file);
        imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    await addDoc(documentsCollection, {
        ...documentData,
        imageUrl,
        file: undefined,
        reportedBy: userId, 
        reportDate: serverTimestamp()
    });
  },

  async updateDocument(id: string, data: Partial<DocumentReport>): Promise<void> {
    const docRef = doc(db, 'documents', id);
    await updateDoc(docRef, data);
  }
};
