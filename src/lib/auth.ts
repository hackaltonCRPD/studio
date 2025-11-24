
'use client';
import { auth } from '@/firebase';
import type { User } from "@/lib/types";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export function getAuthenticatedUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      unsubscribe();
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            resolve({
              id: firebaseUser.uid,
              ...userData
            });
          } else {
            // This case might happen if a user is authenticated but their Firestore document is missing.
            // You might want to create it here, or just treat them as logged out.
            resolve(null); 
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          reject(error);
        }
      } else {
        resolve(null);
      }
    }, reject);
  });
}

export async function logoutUser(): Promise<boolean> {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Error logging out:", error);
        return false;
    }
}
