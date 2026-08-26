import type { Payment } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { serializeDoc } from "../db/timestamps.js";

export class PaymentRepository extends TenantScopedRepository<Payment> {
  protected readonly subcollection = "payments" as const;

  async listByInvoice(tenantId: string, invoiceId: string, limit = 50): Promise<Payment[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("invoiceId", "==", invoiceId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Payment>(d.id, d.data()));
  }
}

export const paymentRepository = new PaymentRepository();
