import { FieldValue, Timestamp, type DocumentData } from "./firestore.js";

export type ServerTimestampFields = {
  createdAt: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
};

export function createTimestamps(): {
  createdAt: ReturnType<typeof FieldValue.serverTimestamp>;
  updatedAt: ReturnType<typeof FieldValue.serverTimestamp>;
} {
  return {
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

export function touchUpdatedAt(): {
  updatedAt: ReturnType<typeof FieldValue.serverTimestamp>;
} {
  return { updatedAt: FieldValue.serverTimestamp() };
}

export function softDeleteStamp(): {
  deletedAt: ReturnType<typeof FieldValue.serverTimestamp>;
  updatedAt: ReturnType<typeof FieldValue.serverTimestamp>;
} {
  return {
    deletedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

export function timestampToIso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return null;
}

export function serializeDoc<T extends Record<string, unknown>>(
  id: string,
  data: DocumentData
): T {
  const out: Record<string, unknown> = { id };
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      out[key] = value.toDate().toISOString();
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
