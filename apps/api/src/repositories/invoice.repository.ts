import type { Invoice } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { serializeDoc } from "../db/timestamps.js";

export class InvoiceRepository extends TenantScopedRepository<Invoice> {
  protected readonly subcollection = "invoices" as const;

  async listByCustomer(tenantId: string, customerId: string, limit = 50): Promise<Invoice[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("customerId", "==", customerId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Invoice>(d.id, d.data()));
  }
}

export const invoiceRepository = new InvoiceRepository();
