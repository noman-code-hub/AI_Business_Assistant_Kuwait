import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Collections } from "./paths";

export type UserProfileDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  locale: "en" | "ar";
  timezone: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
};

export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const snap = await getDoc(doc(db, Collections.users, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfileDoc;
}

export async function ensureUserProfile(user: User): Promise<UserProfileDoc> {
  const ref = doc(db, Collections.users, user.uid);
  const existing = await getDoc(ref);

  const base = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    locale: "en" as const,
    timezone: "Asia/Kuwait",
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    await setDoc(ref, {
      ...base,
      createdAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      ref,
      {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  const refreshed = await getDoc(ref);
  return refreshed.data() as UserProfileDoc;
}
