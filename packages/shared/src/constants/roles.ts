export const Role = {
  OWNER: "owner",
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  READONLY: "readonly",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLES = Object.values(Role);
