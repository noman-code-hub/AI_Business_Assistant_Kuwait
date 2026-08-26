import type { TenantMembership, BusinessMember, Role } from "@aba/shared";
import { AppError } from "@aba/shared";
import { getDb } from "../db/firestore.js";
import { TopLevel, membershipId } from "../db/collections.js";
import { createTimestamps, serializeDoc, softDeleteStamp, touchUpdatedAt } from "../db/timestamps.js";

export class BusinessMemberRepository {
  private col() {
    return getDb().collection(TopLevel.tenantMemberships);
  }

  async get(userId: string, tenantId: string): Promise<BusinessMember | null> {
    if (!userId || !tenantId) throw AppError.validation("userId and tenantId are required");
    const snap = await this.col().doc(membershipId(userId, tenantId)).get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    if (data.deletedAt) return null;
    return serializeDoc<BusinessMember>(snap.id, data);
  }

  async getActiveMembership(userId: string, tenantId: string): Promise<BusinessMember | null> {
    const membership = await this.get(userId, tenantId);
    if (!membership || membership.status !== "active") return null;
    return membership;
  }

  async listByUser(userId: string): Promise<BusinessMember[]> {
    const snap = await this.col().where("userId", "==", userId).where("status", "==", "active").get();
    return snap.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) => serializeDoc<BusinessMember>(d.id, d.data()));
  }

  async create(data: {
    userId: string;
    tenantId: string;
    role: Role;
    status?: TenantMembership["status"];
  }): Promise<BusinessMember> {
    const id = membershipId(data.userId, data.tenantId);
    const ref = this.col().doc(id);
    await ref.set({
      userId: data.userId,
      tenantId: data.tenantId,
      role: data.role,
      status: data.status ?? "active",
      deletedAt: null,
      ...createTimestamps(),
    });
    const created = await ref.get();
    return serializeDoc<BusinessMember>(id, created.data()!);
  }

  async update(
    userId: string,
    tenantId: string,
    patch: Partial<Pick<TenantMembership, "role" | "status">>
  ): Promise<BusinessMember> {
    const existing = await this.get(userId, tenantId);
    if (!existing) throw AppError.notFound("membership");
    await this.col()
      .doc(membershipId(userId, tenantId))
      .set({ ...patch, ...touchUpdatedAt() }, { merge: true });
    const updated = await this.get(userId, tenantId);
    if (!updated) throw AppError.notFound("membership");
    return updated;
  }

  async softDelete(userId: string, tenantId: string): Promise<void> {
    const existing = await this.get(userId, tenantId);
    if (!existing) throw AppError.notFound("membership");
    await this.col().doc(membershipId(userId, tenantId)).set(softDeleteStamp(), { merge: true });
  }
}

export const businessMemberRepository = new BusinessMemberRepository();
export const tenantMembershipRepository = businessMemberRepository;
