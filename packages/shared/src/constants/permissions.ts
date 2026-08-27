import { Role } from "./roles.js";

/**
 * Central permission registry — resource.action naming.
 * Add new permissions here; map them in ROLE_PERMISSIONS.
 */
export const PERMISSIONS = {
  CUSTOMERS_READ: "customers.read",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_UPDATE: "customers.update",
  CUSTOMERS_DELETE: "customers.delete",

  APPOINTMENTS_READ: "appointments.read",
  APPOINTMENTS_CREATE: "appointments.create",
  APPOINTMENTS_UPDATE: "appointments.update",
  APPOINTMENTS_CANCEL: "appointments.cancel",
  APPOINTMENTS_DELETE: "appointments.delete",

  INVOICES_READ: "invoices.read",
  INVOICES_CREATE: "invoices.create",
  INVOICES_UPDATE: "invoices.update",
  INVOICES_DELETE: "invoices.delete",

  PAYMENTS_READ: "payments.read",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_UPDATE: "payments.update",
  PAYMENTS_DELETE: "payments.delete",

  SERVICES_READ: "services.read",
  SERVICES_CREATE: "services.create",
  SERVICES_UPDATE: "services.update",
  SERVICES_DELETE: "services.delete",

  PRODUCTS_READ: "products.read",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",

  BUSINESS_READ: "business.read",
  BUSINESS_UPDATE: "business.update",

  SETTINGS_READ: "settings.read",
  SETTINGS_MANAGE: "settings.manage",

  TEAM_READ: "team.read",
  TEAM_MANAGE: "team.manage",
  TEAM_INVITE: "team.invite",
  TEAM_UPDATE: "team.update",
  TEAM_REMOVE: "team.remove",

  REPORTS_READ: "reports.read",

  NOTIFICATIONS_READ: "notifications.read",
  NOTIFICATIONS_MANAGE: "notifications.manage",

  AUDIT_LOGS_READ: "auditLogs.read",

  SUBSCRIPTION_READ: "subscription.read",
  SUBSCRIPTION_MANAGE: "subscription.manage",

  USAGE_READ: "usage.read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

const P = PERMISSIONS;

/** Read-only baseline used by VIEWER and composed into other roles. */
const READ_BASE: Permission[] = [
  P.CUSTOMERS_READ,
  P.APPOINTMENTS_READ,
  P.INVOICES_READ,
  P.PAYMENTS_READ,
  P.SERVICES_READ,
  P.PRODUCTS_READ,
  P.BUSINESS_READ,
  P.SETTINGS_READ,
  P.TEAM_READ,
  P.REPORTS_READ,
  P.NOTIFICATIONS_READ,
  P.USAGE_READ,
];

/**
 * Role → permission mapping (least privilege).
 * OWNER is not listed here — see `hasPermission` (centralized super-role).
 */
export const ROLE_PERMISSIONS: Record<Exclude<Role, "owner">, readonly Permission[]> = {
  [Role.ADMIN]: [
    ...ALL_PERMISSIONS.filter((p) => p !== P.SUBSCRIPTION_MANAGE),
  ],

  [Role.MANAGER]: [
    ...READ_BASE,
    P.CUSTOMERS_CREATE,
    P.CUSTOMERS_UPDATE,
    P.CUSTOMERS_DELETE,
    P.APPOINTMENTS_CREATE,
    P.APPOINTMENTS_UPDATE,
    P.APPOINTMENTS_CANCEL,
    P.APPOINTMENTS_DELETE,
    P.SERVICES_CREATE,
    P.SERVICES_UPDATE,
    P.SERVICES_DELETE,
    P.PRODUCTS_CREATE,
    P.PRODUCTS_UPDATE,
    P.PRODUCTS_DELETE,
    P.INVOICES_CREATE,
    P.INVOICES_UPDATE,
    P.BUSINESS_UPDATE,
    P.SETTINGS_MANAGE,
    P.TEAM_INVITE,
    P.TEAM_UPDATE,
    P.NOTIFICATIONS_MANAGE,
  ],

  [Role.STAFF]: [
    P.CUSTOMERS_READ,
    P.CUSTOMERS_CREATE,
    P.CUSTOMERS_UPDATE,
    P.APPOINTMENTS_READ,
    P.APPOINTMENTS_CREATE,
    P.APPOINTMENTS_UPDATE,
    P.SERVICES_READ,
    P.PRODUCTS_READ,
    P.BUSINESS_READ,
    P.NOTIFICATIONS_READ,
    P.INVOICES_READ,
  ],

  [Role.RECEPTIONIST]: [
    P.CUSTOMERS_READ,
    P.CUSTOMERS_CREATE,
    P.CUSTOMERS_UPDATE,
    P.APPOINTMENTS_READ,
    P.APPOINTMENTS_CREATE,
    P.APPOINTMENTS_UPDATE,
    P.APPOINTMENTS_CANCEL,
    P.SERVICES_READ,
    P.PRODUCTS_READ,
    P.BUSINESS_READ,
    P.NOTIFICATIONS_READ,
  ],

  [Role.ACCOUNTANT]: [
    P.CUSTOMERS_READ,
    P.BUSINESS_READ,
    P.INVOICES_READ,
    P.INVOICES_CREATE,
    P.INVOICES_UPDATE,
    P.INVOICES_DELETE,
    P.PAYMENTS_READ,
    P.PAYMENTS_CREATE,
    P.PAYMENTS_UPDATE,
    P.PAYMENTS_DELETE,
    P.REPORTS_READ,
    P.SUBSCRIPTION_READ,
    P.USAGE_READ,
    P.NOTIFICATIONS_READ,
  ],

  [Role.VIEWER]: [...READ_BASE],
};

/**
 * Central authorization check.
 * OWNER receives every registered permission in ONE place — do not scatter `role === OWNER`.
 */
export function hasPermission(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (role === Role.OWNER) {
    return (ALL_PERMISSIONS as readonly string[]).includes(permission);
  }
  const granted = ROLE_PERMISSIONS[role as Exclude<Role, "owner">];
  if (!granted) return false;
  return granted.includes(permission);
}

export function permissionsForRole(role: Role | null | undefined): readonly Permission[] {
  if (!role) return [];
  if (role === Role.OWNER) return ALL_PERMISSIONS;
  return ROLE_PERMISSIONS[role as Exclude<Role, "owner">] ?? [];
}

export function hasAnyPermission(
  role: Role | null | undefined,
  permissions: readonly Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: Role | null | undefined,
  permissions: readonly Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
