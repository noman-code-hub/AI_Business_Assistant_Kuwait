import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tenantCustomersPath } from "./paths";

export type CustomerDoc = {
  id: string;
  tenantId: string;
  fullName: string;
  phone?: string;
  email?: string;
  business?: string;
  tags: string[];
  status: "active" | "inactive";
  source: "manual" | "whatsapp" | "booking" | "import";
  notes?: string;
  deletedAt?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type CreateCustomerInput = {
  fullName: string;
  phone?: string;
  email?: string;
  business?: string;
  tags?: string[];
  notes?: string;
};

export function subscribeCustomers(
  tenantId: string,
  onData: (customers: CustomerDoc[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, tenantCustomersPath(tenantId)),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<CustomerDoc, "id">) }))
        .filter((c) => !c.deletedAt);
      onData(items);
    },
    (err) => onError?.(err)
  );
}

export async function createCustomer(
  tenantId: string,
  input: CreateCustomerInput
): Promise<string> {
  const ref = await addDoc(collection(db, tenantCustomersPath(tenantId)), {
    tenantId,
    fullName: input.fullName.trim(),
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    business: input.business?.trim() || "Personal",
    tags: input.tags ?? [],
    status: "active",
    source: "manual",
    notes: input.notes?.trim() || null,
    deletedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}
