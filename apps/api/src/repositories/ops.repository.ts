import type { Notification, Automation, AuditLog, Subscription, UsageRecord } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { getDb } from "../db/firestore.js";
import { tenantCollection } from "../db/collections.js";
import { FieldValue } from "../db/firestore.js";
import { serializeDoc } from "../db/timestamps.js";
import { AppError } from "@aba/shared";

export class NotificationRepository extends TenantScopedRepository<Notification> {
  protected readonly subcollection = "notifications" as const;
}

export class AutomationRepository extends TenantScopedRepository<Automation> {
  protected readonly subcollection = "automations" as const;
}

export class SubscriptionRepository extends TenantScopedRepository<Subscription> {
  protected readonly subcollection = "subscriptions" as const;
}

export class UsageRepository extends TenantScopedRepository<UsageRecord> {
  protected readonly subcollection = "usage" as const;
}

/** Append-only audit foundation — no updates/deletes via repository. */
export class AuditLogRepository {
  private col(tenantId: string) {
    if (!tenantId) throw AppError.validation("tenantId is required");
    return getDb().collection(tenantCollection(tenantId, "auditLogs"));
  }

  async append(
    tenantId: string,
    entry: Omit<AuditLog, "id" | "createdAt" | "tenantId"> & { id?: string }
  ): Promise<AuditLog> {
    if ((entry as { tenantId?: string }).tenantId && (entry as { tenantId?: string }).tenantId !== tenantId) {
      throw AppError.forbidden("Cannot write audit log for another tenant");
    }
    const ref = entry.id ? this.col(tenantId).doc(entry.id) : this.col(tenantId).doc();
    const { id: _i, ...rest } = entry;
    await ref.set({
      ...rest,
      tenantId,
      createdAt: FieldValue.serverTimestamp(),
    });
    const created = await ref.get();
    return serializeDoc<AuditLog>(ref.id, created.data()!);
  }

  async list(tenantId: string, limit = 50): Promise<AuditLog[]> {
    const snap = await this.col(tenantId).orderBy("createdAt", "desc").limit(limit).get();
    return snap.docs
      .filter((d) => d.data().tenantId === tenantId)
      .map((d) => serializeDoc<AuditLog>(d.id, d.data()));
  }

  async getById(tenantId: string, id: string): Promise<AuditLog | null> {
    const snap = await this.col(tenantId).doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    if (data.tenantId !== tenantId) throw AppError.forbidden("Cross-tenant access denied");
    return serializeDoc<AuditLog>(snap.id, data);
  }
}

export const notificationRepository = new NotificationRepository();
export const automationRepository = new AutomationRepository();
export const subscriptionRepository = new SubscriptionRepository();
export const usageRepository = new UsageRepository();
export const auditLogRepository = new AuditLogRepository();
