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
    const snap = await this.col(tenantId).where("tenantId", "==", tenantId).limit(500).get();

    return snap.docs
      .filter((d) => {
        const data = d.data();
        if (data.deletedAt) return false;
        const startsAt = typeof data.startsAt === "string" ? data.startsAt : null;
        if (!startsAt) return false;
        return startsAt >= startIso && startsAt <= endIso;
      })
      .sort((a, b) => String(a.data().startsAt).localeCompare(String(b.data().startsAt)))
      .slice(0, limit)
      .map((d) => serializeDoc<Appointment>(d.id, d.data()));
  }
}

export const appointmentRepository = new AppointmentRepository();
