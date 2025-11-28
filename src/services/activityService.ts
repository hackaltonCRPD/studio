
'use client';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { ActivityLog } from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined): string => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
}

const activityCollection = collection(db, 'activity');

export const activityService = {
  async getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    const q = query(activityCollection, where('userId', '==', userId));
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: fromTimestamp(doc.data().timestamp as Timestamp),
      })) as ActivityLog[];
    } catch (error) {
      console.error(`Error fetching activity logs for user ${userId}:`, error);
      return [];
    }
  }
};
