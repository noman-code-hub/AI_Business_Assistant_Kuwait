import { AppError } from "@aba/shared";
import { getDb } from "../db/firestore.js";
import { SOFT_DELETE_FIELD, tenantCollection, type TenantSubcollection } from "../db/collections.js";
import { createTimestamps, serializeDoc, softDeleteStamp, touchUpdatedAt } from "../db/timestamps.js";
import type { DocumentData, Query } from "firebase-admin/firestore";

export type ListOptions = {
  limit?: number;
  status?: string;
  includeDeleted?: boolean;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};

/**
 * Base tenant-scoped repository.
 * Every operation requires tenantId — never omit tenant context.
 * Path isolation + document.tenantId verification prevent cross-tenant leaks.
 */
export abstract class TenantScopedRepository<T extends { id: string; tenantId: string }> {
  protected abstract readonly subcollection: TenantSubcollection;

  protected col(tenantId: string) {
    this.assertTenantId(tenantId);
    return getDb().collection(tenantCollection(tenantId, this.subcollection));
  }

  protected assertTenantId(tenantId: string): void {
    if (!tenantId || typeof tenantId !== "string") {
      throw AppError.validation("tenantId is required");
    }
  }

  protected assertDocTenant(tenantId: string, data: DocumentData | undefined): void {
    if (!data || data.tenantId !== tenantId) {
      throw AppError.forbidden("Cross-tenant access denied");
    }
  }

  async getById(tenantId: string, id: string): Promise<T | null> {
    const snap = await this.col(tenantId).doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    this.assertDocTenant(tenantId, data);
    if (data[SOFT_DELETE_FIELD]) return null;
    return serializeDoc<T>(snap.id, data);
  }

  async list(tenantId: string, options: ListOptions = {}): Promise<T[]> {
    const limit = Math.min(options.limit ?? 50, 100);
    // Scoped by path; still filter tenantId field for defense in depth when possible.
    let q: Query = this.col(tenantId);

    if (options.status) {
      q = q.where("status", "==", options.status);
    }

    q = q.orderBy(options.orderBy ?? "createdAt", options.orderDirection ?? "desc").limit(limit);

    const snap = await q.get();
    return snap.docs
      .filter((d) => {
        const data = d.data();
        if (data.tenantId !== tenantId) return false;
        if (!options.includeDeleted && data[SOFT_DELETE_FIELD]) return false;
        return true;
      })
      .map((d) => serializeDoc<T>(d.id, d.data()));
  }

  /** Firestore rejects `undefined` — omit those keys (or use null explicitly in callers). */
  protected omitUndefined(data: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) out[key] = value;
    }
    return out;
  }

  async create(
    tenantId: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ): Promise<T> {
    this.assertTenantId(tenantId);
    const incomingTenant = (data as { tenantId?: string }).tenantId;
    if (incomingTenant && incomingTenant !== tenantId) {
      throw AppError.forbidden("Cannot create resource for another tenant");
    }

    const ref = data.id ? this.col(tenantId).doc(data.id) : this.col(tenantId).doc();
    const { id: _ignore, ...rest } = data as { id?: string } & Record<string, unknown>;
    const payload = this.omitUndefined({
      ...rest,
      tenantId,
      deletedAt: null,
      ...createTimestamps(),
    });
    await ref.set(payload);
    const created = await ref.get();
    return serializeDoc<T>(ref.id, created.data()!);
  }

  async update(
    tenantId: string,
    id: string,
    patch: Partial<Omit<T, "id" | "tenantId" | "createdAt">>
  ): Promise<T> {
    const existing = await this.getById(tenantId, id);
    if (!existing) throw AppError.notFound(this.subcollection);

    const safe = this.omitUndefined({ ...(patch as Record<string, unknown>) });
    delete safe.tenantId;
    delete safe.id;
    delete safe.createdAt;

    await this.col(tenantId)
      .doc(id)
      .set({ ...safe, ...touchUpdatedAt() }, { merge: true });

    const updated = await this.getById(tenantId, id);
    if (!updated) throw AppError.notFound(this.subcollection);
    return updated;
  }

  /** Soft delete — sets deletedAt. Hard delete is reserved for admin jobs. */
  async delete(tenantId: string, id: string): Promise<void> {
    const existing = await this.getById(tenantId, id);
    if (!existing) throw AppError.notFound(this.subcollection);
    await this.col(tenantId).doc(id).set(softDeleteStamp(), { merge: true });
  }

  async softDelete(tenantId: string, id: string): Promise<void> {
    return this.delete(tenantId, id);
  }

  /** Count non-deleted documents in tenant subcollection. */
  async countActive(
    tenantId: string,
    options: { status?: string } = {}
  ): Promise<number> {
    this.assertTenantId(tenantId);
    let q = this.col(tenantId).where("tenantId", "==", tenantId);
    if (options.status) {
      q = q.where("status", "==", options.status);
    }
    const snap = await q.select("deletedAt").get();
    return snap.docs.filter((d) => !d.data().deletedAt).length;
  }
}
