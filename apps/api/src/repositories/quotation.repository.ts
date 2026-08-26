import type { Quotation } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { serializeDoc } from "../db/timestamps.js";

export class QuotationRepository extends TenantScopedRepository<Quotation> {
  protected readonly subcollection = "quotations" as const;

  async listByCustomer(tenantId: string, customerId: string, limit = 50): Promise<Quotation[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("customerId", "==", customerId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Quotation>(d.id, d.data()));
  }
}

export const quotationRepository = new QuotationRepository();
