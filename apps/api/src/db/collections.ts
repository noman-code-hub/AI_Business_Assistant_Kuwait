/** Canonical Firestore collection / path helpers. Business ≈ Tenant. */

export const TopLevel = {
  users: "users",
  tenants: "tenants",
  tenantMemberships: "tenantMemberships",
} as const;

export type TenantSubcollection =
  | "customers"
  | "services"
  | "products"
  | "appointments"
  | "quotations"
  | "invoices"
  | "payments"
  | "conversations"
  | "notifications"
  | "automations"
  | "auditLogs"
  | "subscriptions"
  | "usage"
  | "bookings"
  | "staff";

export function tenantPath(tenantId: string): string {
  return `${TopLevel.tenants}/${tenantId}`;
}

export function tenantCollection(tenantId: string, name: TenantSubcollection): string {
  return `${tenantPath(tenantId)}/${name}`;
}

export function membershipId(userId: string, tenantId: string): string {
  return `${userId}_${tenantId}`;
}

/**
 * Soft-delete strategy (Phase 1):
 * Prefer `deletedAt` timestamp; repositories exclude deleted docs by default.
 * Hard delete reserved for admin/cleanup jobs.
 */
export const SOFT_DELETE_FIELD = "deletedAt" as const;

/** Messages path: tenants/{tenantId}/conversations/{conversationId}/messages/{messageId} */
export function conversationMessagesPath(
  tenantId: string,
  conversationId: string
): string {
  return `${tenantCollection(tenantId, "conversations")}/${conversationId}/messages`;
}
