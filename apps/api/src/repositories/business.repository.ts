import type { Tenant, Business } from "@aba/shared";
import { AppError } from "@aba/shared";
import { getDb } from "../db/firestore.js";
import { TopLevel } from "../db/collections.js";
import { createTimestamps, serializeDoc, softDeleteStamp, touchUpdatedAt } from "../db/timestamps.js";

/** Business ≈ Tenant. Canonical collection: `tenants`. */
export class BusinessRepository {
  private col() {
    return getDb().collection(TopLevel.tenants);
  }

  async getById(tenantId: string): Promise<Business | null> {
    if (!tenantId) throw AppError.validation("tenantId is required");
    const snap = await this.col().doc(tenantId).get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    if (data.deletedAt) return null;
    return serializeDoc<Business>(snap.id, data);
  }

  async getBySlug(slug: string): Promise<Business | null> {
    const snap = await this.col().where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    if (doc.data().deletedAt) return null;
    return serializeDoc<Business>(doc.id, doc.data());
  }

  async create(
    data: Omit<Tenant, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ): Promise<Business> {
    const ref = data.id ? this.col().doc(data.id) : this.col().doc();
    const { id: _i, ...rest } = data;
    await ref.set({
      ...rest,
      deletedAt: null,
      ...createTimestamps(),
    });
    const created = await ref.get();
    return serializeDoc<Business>(ref.id, created.data()!);
  }

  async update(
    tenantId: string,
    patch: Partial<Omit<Tenant, "id" | "createdAt">>
  ): Promise<Business> {
    const existing = await this.getById(tenantId);
    if (!existing) throw AppError.notFound("tenant");

    const safe = { ...(patch as Record<string, unknown>) };
    delete safe.id;
    delete safe.createdAt;

    await this.col().doc(tenantId).set({ ...safe, ...touchUpdatedAt() }, { merge: true });
    const updated = await this.getById(tenantId);
    if (!updated) throw AppError.notFound("tenant");
    return updated;
  }

  async softDelete(tenantId: string): Promise<void> {
    const existing = await this.getById(tenantId);
    if (!existing) throw AppError.notFound("tenant");
    await this.col().doc(tenantId).set(softDeleteStamp(), { merge: true });
  }
}

export const businessRepository = new BusinessRepository();
/** Alias — prefer businessRepository / tenants collection naming. */
export const tenantRepository = businessRepository;
