import {
  AppError,
  Role,
  MembershipStatus,
  normalizeRole,
  type BusinessMember,
} from "@aba/shared";
import { businessMemberRepository } from "../../../repositories/business-member.repository.js";
import { auditLogRepository } from "../../../repositories/ops.repository.js";

export type AuthzContext = {
  userId: string;
  tenantId: string;
  role: Role;
};

/**
 * List memberships for the current tenant (excludes removed).
 */
export async function listTenantMemberships(tenantId: string): Promise<BusinessMember[]> {
  return businessMemberRepository.listByTenant(tenantId);
}

/**
 * Change a member's role within the same tenant.
 * - Never assigns OWNER via this path
 * - Never lets a user elevate themselves to OWNER
 * - Protects last active OWNER
 */
export async function updateMemberRole(
  ctx: AuthzContext,
  targetUserId: string,
  nextRoleRaw: string
): Promise<BusinessMember> {
  const nextRole = normalizeRole(nextRoleRaw);
  if (!nextRole) {
    throw AppError.validation("Invalid role");
  }
  if (nextRole === Role.OWNER) {
    throw AppError.permissionDenied("OWNER cannot be assigned via role update.");
  }

  if (targetUserId === ctx.userId && nextRole !== normalizeRole(ctx.role)) {
    // Self-role changes are blocked except no-op; elevation to OWNER already denied above.
    // Spec: a user must NEVER change their own role to OWNER — block self role changes entirely.
    throw AppError.permissionDenied("You cannot change your own role.");
  }

  const target = await businessMemberRepository.get(targetUserId, ctx.tenantId);
  if (!target) {
    throw AppError.notFound("membership");
  }
  if (target.tenantId !== ctx.tenantId) {
    throw AppError.tenantAccessDenied();
  }

  const currentRole = normalizeRole(target.role);
  if (currentRole === Role.OWNER) {
    const owners = await businessMemberRepository.countActiveOwners(ctx.tenantId);
    if (owners <= 1 && target.status === MembershipStatus.ACTIVE) {
      throw AppError.lastOwnerRequired();
    }
  }

  const updated = await businessMemberRepository.update(targetUserId, ctx.tenantId, {
    role: nextRole,
  });

  try {
    await auditLogRepository.append(ctx.tenantId, {
      actorUserId: ctx.userId,
      action: "membership.role_changed",
      resourceType: "tenantMembership",
      resourceId: updated.id,
      metadata: { from: currentRole, to: nextRole, targetUserId },
    });
  } catch {
    // Non-fatal
  }

  return updated;
}

/**
 * Suspend or remove a member. Enforces last-owner protection.
 */
export async function updateMemberStatus(
  ctx: AuthzContext,
  targetUserId: string,
  status: typeof MembershipStatus.ACTIVE | typeof MembershipStatus.SUSPENDED | typeof MembershipStatus.REMOVED
): Promise<BusinessMember> {
  const target = await businessMemberRepository.get(targetUserId, ctx.tenantId);
  if (!target) {
    throw AppError.notFound("membership");
  }
  if (target.tenantId !== ctx.tenantId) {
    throw AppError.tenantAccessDenied();
  }

  const currentRole = normalizeRole(target.role);
  const deactivating =
    status === MembershipStatus.SUSPENDED || status === MembershipStatus.REMOVED;

  if (deactivating && currentRole === Role.OWNER && target.status === MembershipStatus.ACTIVE) {
    const owners = await businessMemberRepository.countActiveOwners(ctx.tenantId);
    if (owners <= 1) {
      throw AppError.lastOwnerRequired();
    }
  }

  if (status === MembershipStatus.REMOVED) {
    await businessMemberRepository.softDelete(targetUserId, ctx.tenantId);
    try {
      await auditLogRepository.append(ctx.tenantId, {
        actorUserId: ctx.userId,
        action: "membership.removed",
        resourceType: "tenantMembership",
        resourceId: target.id,
        metadata: { targetUserId },
      });
    } catch {
      // Non-fatal
    }
    return { ...target, status: MembershipStatus.REMOVED, deletedAt: new Date().toISOString() };
  }

  const updated = await businessMemberRepository.update(targetUserId, ctx.tenantId, { status });

  try {
    await auditLogRepository.append(ctx.tenantId, {
      actorUserId: ctx.userId,
      action:
        status === MembershipStatus.SUSPENDED
          ? "membership.suspended"
          : "membership.reactivated",
      resourceType: "tenantMembership",
      resourceId: updated.id,
      metadata: { targetUserId, status },
    });
  } catch {
    // Non-fatal
  }

  return updated;
}
