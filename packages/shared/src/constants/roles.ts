/**
 * Tenant-scoped business roles (Phase 4 RBAC).
 * Role is stored on BusinessMember / TenantMembership — never trusted from the client.
 */
export const Role = {
  OWNER: "owner",
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  RECEPTIONIST: "receptionist",
  ACCOUNTANT: "accountant",
  VIEWER: "viewer",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLES = Object.values(Role);

/** Roles that can be assigned via team management (OWNER is never assignable this way). */
export const ASSIGNABLE_ROLES = ROLES.filter((r) => r !== Role.OWNER);

/**
 * Normalize legacy / unknown role strings from older memberships.
 * Maps historical `readonly` → `viewer`.
 */
export function normalizeRole(value: string | null | undefined): Role | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "readonly") return Role.VIEWER;
  if ((ROLES as string[]).includes(v)) return v as Role;
  return null;
}
