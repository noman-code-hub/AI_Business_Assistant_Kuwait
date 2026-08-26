export const TenantStatus = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  TRIAL: "trial",
  PENDING: "pending",
} as const;

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus];

export const EntityStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;

export type EntityStatus = (typeof EntityStatus)[keyof typeof EntityStatus];

export const AppointmentStatus = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const InvoiceStatus = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  VOID: "void",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
