import type { Customer, EntityStatus } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { serializeDoc } from "../db/timestamps.js";

/** Soft cap for tenant-scoped CRM scans (search / export / import duplicate checks). */
export const CUSTOMER_SCAN_LIMIT = 5000;

export type CustomerScanOptions = {
  status?: EntityStatus | string;
  includeDeleted?: boolean;
  limit?: number;
};

export class CustomerRepository extends TenantScopedRepository<Customer> {
  protected readonly subcollection = "customers" as const;

  /**
   * Path-scoped load of active customers (no composite index required).
   * Used for search/filter/export within a single tenant.
   */
  async listAllActive(tenantId: string, options: CustomerScanOptions = {}): Promise<Customer[]> {
    this.assertTenantId(tenantId);
    const limit = Math.min(options.limit ?? CUSTOMER_SCAN_LIMIT, CUSTOMER_SCAN_LIMIT);
    const snap = await this.col(tenantId).where("tenantId", "==", tenantId).limit(limit).get();

    return snap.docs
      .filter((d) => {
        const data = d.data();
        if (!options.includeDeleted && data.deletedAt) return false;
        if (options.status && data.status !== options.status) return false;
        return true;
      })
      .map((d) => serializeDoc<Customer>(d.id, d.data()));
  }

  async listByPhone(tenantId: string, phone: string, limit = 20): Promise<Customer[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("phone", "==", phone)
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Customer>(d.id, d.data()));
  }

  async listByWhatsApp(tenantId: string, whatsapp: string, limit = 20): Promise<Customer[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("whatsapp", "==", whatsapp)
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Customer>(d.id, d.data()));
  }

  async listByEmail(tenantId: string, email: string, limit = 20): Promise<Customer[]> {
    this.assertTenantId(tenantId);
    const normalized = email.trim().toLowerCase();
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("email", "==", normalized)
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Customer>(d.id, d.data()));
  }

  async findDuplicate(
    tenantId: string,
    input: { phone?: string; whatsapp?: string; email?: string },
    excludeId?: string
  ): Promise<{ customer: Customer; reason: string } | null> {
    if (input.phone) {
      const hits = await this.listByPhone(tenantId, input.phone, 5);
      const hit = hits.find((c) => c.id !== excludeId);
      if (hit) return { customer: hit, reason: "phone" };
    }
    if (input.whatsapp) {
      const hits = await this.listByWhatsApp(tenantId, input.whatsapp, 5);
      const hit = hits.find((c) => c.id !== excludeId);
      if (hit) return { customer: hit, reason: "whatsapp" };
    }
    if (input.email) {
      const hits = await this.listByEmail(tenantId, input.email, 5);
      const hit = hits.find((c) => c.id !== excludeId);
      if (hit) return { customer: hit, reason: "email" };
    }
    return null;
  }
}

export const customerRepository = new CustomerRepository();
