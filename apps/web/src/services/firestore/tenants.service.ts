import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Collections, membershipDocId } from "./paths";

export type TenantDoc = {
  id: string;
  name: string;
  slug: string;
  vertical: string;
  status: "trial" | "active" | "suspended" | "pending";
  locale: "en" | "ar";
  timezone: string;
  currency: "KWD";
  ownerUid: string;
  planId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type MembershipDoc = {
  id: string;
  tenantId: string;
  userId: string;
  role:
    | "owner"
    | "admin"
    | "manager"
    | "staff"
    | "receptionist"
    | "accountant"
    | "viewer"
    | "readonly";
  status: "active" | "invited" | "suspended" | "removed" | "disabled";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function listMembershipsForUser(userId: string): Promise<MembershipDoc[]> {
  // Single-field query avoids requiring a composite index during bootstrap.
  const q = query(collection(db, Collections.tenantMemberships), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data() as MembershipDoc)
    .filter((m) => m.status === "active");
}

export async function getTenant(tenantId: string): Promise<TenantDoc | null> {
  const snap = await getDoc(doc(db, Collections.tenants, tenantId));
  if (!snap.exists()) return null;
  return snap.data() as TenantDoc;
}

export async function createTenantForOwner(user: User, name?: string): Promise<{
  tenant: TenantDoc;
  membership: MembershipDoc;
}> {
  const tenantRef = doc(collection(db, Collections.tenants));
  const tenantId = tenantRef.id;
  const display = name?.trim() || user.displayName?.trim() || user.email?.split("@")[0] || "My Business";
  const slugBase = slugify(display) || "business";
  const slug = `${slugBase}-${tenantId.slice(0, 6)}`;

  const tenant: TenantDoc = {
    id: tenantId,
    name: display,
    slug,
    vertical: "sme",
    status: "trial",
    locale: "en",
    timezone: "Asia/Kuwait",
    currency: "KWD",
    ownerUid: user.uid,
    planId: "trial",
  };

  const membershipId = membershipDocId(user.uid, tenantId);
  const membership: MembershipDoc = {
    id: membershipId,
    tenantId,
    userId: user.uid,
    role: "owner",
    status: "active",
  };

  await setDoc(tenantRef, {
    ...tenant,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, Collections.tenantMemberships, membershipId), {
    ...membership,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { tenant, membership };
}

/**
 * @deprecated Phase 3: businesses are created via POST /api/v1/tenants.
 * Kept for reference; no longer auto-creates tenants.
 */
export async function ensureUserTenant(user: User): Promise<{
  tenant: TenantDoc;
  membership: MembershipDoc;
  created: boolean;
}> {
  const memberships = await listMembershipsForUser(user.uid);
  const first = memberships[0];
  if (first) {
    const tenant = await getTenant(first.tenantId);
    if (tenant) {
      return { tenant, membership: first, created: false };
    }
  }

  throw new Error("No business found. Complete onboarding to create one.");
}
