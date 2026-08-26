import type { Appointment } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { serializeDoc } from "../db/timestamps.js";

export class AppointmentRepository extends TenantScopedRepository<Appointment> {
  protected readonly subcollection = "appointments" as const;

  async listByCustomer(tenantId: string, customerId: string, limit = 50): Promise<Appointment[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("customerId", "==", customerId)
      .orderBy("startsAt", "desc")
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Appointment>(d.id, d.data()));
  }

  async listByDateRange(
    tenantId: string,
    startIso: string,
    endIso: string,
    limit = 100
  ): Promise<Appointment[]> {
    this.assertTenantId(tenantId);
    const snap = await this.col(tenantId)
      .where("tenantId", "==", tenantId)
      .where("startsAt", ">=", startIso)
      .where("startsAt", "<=", endIso)
      .orderBy("startsAt", "asc")
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<Appointment>(d.id, d.data()));
  }
}

export const appointmentRepository = new AppointmentRepository();
