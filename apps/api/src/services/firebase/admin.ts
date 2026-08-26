import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getEnv } from "../../config/env.js";

let app: App | null = null;

export function isFirebaseAdminConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}

export function getFirebaseAdminApp(): App | null {
  if (app) return app;
  if (!isFirebaseAdminConfigured()) return null;

  const env = getEnv();
  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }

  app = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID!,
      clientEmail: env.FIREBASE_CLIENT_EMAIL!,
      privateKey: env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
  });

  return app;
}

export function getFirebaseAuth(): Auth | null {
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  return getAuth(adminApp);
}
