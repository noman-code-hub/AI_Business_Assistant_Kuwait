import type { Payment } from "@aba/shared";
import { PaymentStatus } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { serializeDoc, timestampToIso } from "../db/timestamps.js";

export class PaymentRepository extends TenantScopedRepository<Payment> {
  protected readonly subcollection = "payments" as const;

  async listByInvoice(tenantId: string, invoiceId: string, limit = 50): Promise<Payment[]> {
    this.assertTenantId(tenantId);
    // Path-scoped collection — filter in memory to avoid composite index requirements.
    const snap = await this.col(tenantId).where("tenantId", "==", tenantId).limit(500).get();

    return snap.docs
      .filter((d) => !d.data().deletedAt && d.data().invoiceId === invoiceId)
      .slice(0, limit)
      .map((d) => serializeDoc<Payment>(d.id, d.data()));
  }

  /**
   * Completed payments with paidAt in [startIso, endIso].
   * Uses tenant path scope + in-memory filter (no composite index required).
   */
  async listCompletedInRange(
    tenantId: string,
    startIso: string,
    endIso: string,
    limit = 500
  ): Promise<Payment[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId).where("tenantId", "==", tenantId).limit(2000).get();

    return snap.docs
      .filter((d) => {
        const data = d.data();
        if (data.deletedAt) return false;
        if (data.status !== PaymentStatus.COMPLETED) return false;
        const paidAt = timestampToIso(data.paidAt);
        if (!paidAt) return false;
        return paidAt >= startIso && paidAt <= endIso;
      })
      .sort((a, b) => {
        const aPaid = timestampToIso(a.data().paidAt) ?? "";
        const bPaid = timestampToIso(b.data().paidAt) ?? "";
        return aPaid.localeCompare(bPaid);
      })
      .slice(0, limit)
      .map((d) => serializeDoc<Payment>(d.id, d.data()));
  }
}

export const paymentRepository = new PaymentRepository();
