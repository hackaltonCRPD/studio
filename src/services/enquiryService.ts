
'use client';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Enquiry } from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined): string => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
}

const enquiriesCollection = collection(db, 'enquiries');

export const enquiryService = {
  async getEnquiries(status?: 'open' | 'resolved' | 'all'): Promise<Enquiry[]> {
    let q = query(enquiriesCollection);
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status));
    }

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: fromTimestamp(doc.data().date as Timestamp),
      })) as Enquiry[];
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      return [];
    }
  },

  async addEnquiry(
    enquiryData: Omit<Enquiry, 'id' | 'date' | 'status'>,
    userId: string | null
  ): Promise<void> {
    await addDoc(enquiriesCollection, {
      ...enquiryData,
      userId: userId,
      date: serverTimestamp(),
      status: "open",
    });
  },

  async updateEnquiryStatus(id: string, status: 'open' | 'resolved'): Promise<void> {
    const enquiryRef = doc(db, "enquiries", id);
    await updateDoc(enquiryRef, { status });
  }
};
