import {
  FieldValue,
  Timestamp,
  getFirestore,
  type Firestore,
  type DocumentData,
} from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import { AppError } from "@aba/shared";
import { getFirebaseAdminApp, isFirebaseAdminConfigured } from "../services/firebase/admin.js";

export function requireFirebaseAdmin(): NonNullable<ReturnType<typeof getFirebaseAdminApp>> {
  const app = getFirebaseAdminApp();
  if (!app) {
    throw AppError.internal(
      isFirebaseAdminConfigured()
        ? "Firebase Admin failed to initialize"
        : "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
    );
  }
  return app;
}

export function getDb(): Firestore {
  return getFirestore(requireFirebaseAdmin());
}

export function getBucket(): { name: string; [key: string]: unknown } {
  const app = requireFirebaseAdmin();
  const storage: Storage = getStorage(app);
  const envBucket = process.env.FIREBASE_STORAGE_BUCKET;
  const bucket = envBucket ? storage.bucket(envBucket) : storage.bucket();
  return bucket as unknown as { name: string; [key: string]: unknown };
}

export { FieldValue, Timestamp, type DocumentData, type Firestore };
