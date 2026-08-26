import type { Customer } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";

export class CustomerRepository extends TenantScopedRepository<Customer> {
  protected readonly subcollection = "customers" as const;

  async listByPhone(tenantId: string, phone: string, limit = 20): Promise<Customer[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("phone", "==", phone)
      .limit(limit)
      .get();

    const { serializeDoc } = await import("../db/timestamps.js");
    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Customer>(d.id, d.data()));
  }
}

export const customerRepository = new CustomerRepository();
