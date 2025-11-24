
"use client";
import { firebaseApp, auth, db } from ".";
import { FirebaseProvider } from "./provider";

export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <FirebaseProvider app={firebaseApp} auth={auth} db={db}>
      {children}
    </FirebaseProvider>
  );
};
