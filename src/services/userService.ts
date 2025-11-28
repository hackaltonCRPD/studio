
'use client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type {
  User,
  UserStatus,
  UserRole,
} from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined): string => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
}

const usersCollection = collection(db, 'users');

export const userService = {
  async getUsers(filters?: {
    status?: UserStatus | 'all';
    role?: UserRole | 'all';
  }): Promise<User[]> {
    let q = query(usersCollection);

    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.role && filters.role !== 'all') {
      q = query(q, where('role', '==', filters.role));
    }

    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: fromTimestamp(doc.data().createdAt as Timestamp),
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { 
            id: userDoc.id, 
            ...userData, 
            createdAt: fromTimestamp(userData.createdAt as Timestamp) 
        } as User;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }
  },
  
  async updateUser(id: string, data: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, data);
  }
};
