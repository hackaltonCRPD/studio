
'use client';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  doc
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Notification } from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined | { toDate: () => Date }): string => {
  if (!timestamp) return new Date().toISOString();
  if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toISOString();
  }
  return new Date(timestamp as any).toISOString();
}

const notificationsCollection = collection(db, 'notifications');

export const notificationService = {
  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    const q = query(notificationsCollection, where('userId', '==', userId));
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: fromTimestamp(doc.data().timestamp as Timestamp),
      })) as Notification[];
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      return [];
    }
  },

  async addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Promise<void> {
    await addDoc(notificationsCollection, {
        ...notification,
        timestamp: serverTimestamp(),
        isRead: false,
    });
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { isRead: true });
  },

  async markAllNotificationsAsRead(notificationsToUpdate: Notification[]): Promise<void> {
    const batch = writeBatch(db);
    notificationsToUpdate.forEach(n => {
        const notifRef = doc(db, "notifications", n.id);
        batch.update(notifRef, { isRead: true });
    });
    await batch.commit();
  }
};
