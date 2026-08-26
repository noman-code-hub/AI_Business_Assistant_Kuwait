import { getDb } from "./firestore.js";
import type { Transaction, WriteBatch } from "firebase-admin/firestore";

export async function runTransaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
  return getDb().runTransaction(fn);
}

export function writeBatch(): WriteBatch {
  return getDb().batch();
}

export { getDb, getBucket, requireFirebaseAdmin, FieldValue, Timestamp } from "./firestore.js";
export * from "./collections.js";
export * from "./timestamps.js";
