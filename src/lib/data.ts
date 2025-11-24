
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
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type {
  DocumentReport,
  User,
  Feedback,
  Enquiry,
  ActivityLog,
  Notification,
  UserStatus,
  UserRole,
} from '@/lib/types';

const fromTimestamp = (timestamp: Timestamp | undefined) => {
  return timestamp ? timestamp.toDate().toISOString() : new Date().toISOString();
}

// --- USER FUNCTIONS ---
export async function getUsers(filters?: {
  status?: UserStatus | 'all';
  role?: UserRole | 'all';
}): Promise<User[]> {
  const usersRef = collection(db, 'users');
  let q = query(usersRef);

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
      createdAt: fromTimestamp(doc.data().createdAt),
    })) as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data(), createdAt: fromTimestamp(userDoc.data().createdAt) } as User;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

// --- DOCUMENT FUNCTIONS ---
export async function getDocuments(filters?: {
  documentType?: string;
  location?: string;
  status?: string;
}): Promise<DocumentReport[]> {
  const documentsRef = collection(db, 'documents');
  let q = query(documentsRef);

  if (filters?.documentType && filters.documentType !== 'all') {
    q = query(q, where('documentType', '==', filters.documentType));
  }
  if (filters?.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status));
  }
  // Firestore doesn't support full-text search out-of-the-box on client.
  // A simple equality check for location will be used.
  if (filters?.location) {
    q = query(q, where('location', '>=', filters.location), where('location', '<=', filters.location + '\uf8ff'));
  }

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateLost: fromTimestamp(doc.data().dateLost),
      reportDate: fromTimestamp(doc.data().reportDate),
    })) as DocumentReport[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<DocumentReport | null> {
  try {
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
       const data = docSnap.data();
      return { 
          id: docSnap.id,
          ...data,
          dateLost: fromTimestamp(data.dateLost),
          reportDate: fromTimestamp(data.reportDate),
      } as DocumentReport;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${id}:`, error);
    return null;
  }
}

// --- FEEDBACK & ENQUIRY FUNCTIONS ---
export async function getFeedbacks(
  status?: 'open' | 'resolved' | 'all'
): Promise<Feedback[]> {
  const feedbackRef = collection(db, 'feedback');
  let q = query(feedbackRef);

  if (status && status !== 'all') {
    q = query(q, where('status', '==', status));
  }
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: fromTimestamp(doc.data().date)
    })) as Feedback[];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
}

export async function getEnquiries(
  status?: 'open' | 'resolved' | 'all'
): Promise<Enquiry[]> {
  const enquiriesRef = collection(db, 'enquiries');
  let q = query(enquiriesRef);
  if (status && status !== 'all') {
    q = query(q, where('status', '==', status));
  }

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: fromTimestamp(doc.data().date),
    })) as Enquiry[];
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }
}

// --- ACTIVITY LOG FUNCTIONS ---
export async function getActivityLogsForUser(
  userId: string
): Promise<ActivityLog[]> {
  const activityRef = collection(db, 'activity');
  const q = query(activityRef, where('userId', '==', userId));
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: fromTimestamp(doc.data().timestamp),
    })) as ActivityLog[];
  } catch (error) {
    console.error(`Error fetching activity logs for user ${userId}:`, error);
    return [];
  }
}

// --- NOTIFICATION FUNCTIONS ---
export async function getNotificationsForUser(
  userId: string
): Promise<Notification[]> {
   const notificationsRef = collection(db, 'notifications');
   const q = query(notificationsRef, where('userId', '==', userId));
   try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: fromTimestamp(doc.data().timestamp),
    })) as Notification[];
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    return [];
  }
}
