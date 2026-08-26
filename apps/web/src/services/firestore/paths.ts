export const Collections = {
  users: "users",
  tenants: "tenants",
  tenantMemberships: "tenantMemberships",
} as const;

export function tenantCustomersPath(tenantId: string) {
  return `${Collections.tenants}/${tenantId}/customers`;
}

export function membershipDocId(userId: string, tenantId: string) {
  return `${userId}_${tenantId}`;
}
