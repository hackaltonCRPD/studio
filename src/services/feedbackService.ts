
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
import type { Feedback } from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined): string => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
}

const feedbackCollection = collection(db, 'feedback');

export const feedbackService = {
  async getFeedbacks(status?: 'open' | 'resolved' | 'all'): Promise<Feedback[]> {
    let q = query(feedbackCollection);
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status));
    }
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: fromTimestamp(doc.data().date as Timestamp)
      })) as Feedback[];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  },

  async addFeedback(
    feedbackData: Omit<Feedback, 'id' | 'date' | 'status' | 'userId'>, 
    userId: string
  ): Promise<void> {
    await addDoc(feedbackCollection, {
      ...feedbackData,
      userId: userId,
      date: serverTimestamp(),
      status: "open",
    });
  },

  async updateFeedbackStatus(id: string, status: 'open' | 'resolved'): Promise<void> {
    const feedbackRef = doc(db, "feedback", id);
    await updateDoc(feedbackRef, { status });
  }
};
