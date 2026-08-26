import type { Role } from "@aba/shared";

export type AuthenticatedUser = {
  uid: string;
  email?: string;
  emailVerified?: boolean;
};

export type RequestContext = {
  requestId: string;
  user?: AuthenticatedUser;
  tenantId?: string;
  role?: Role;
};

declare global {
  namespace Express {
    interface Locals {
      requestId: string;
      user?: AuthenticatedUser;
      tenantId?: string;
      role?: Role;
      startedAt: number;
    }
  }
}

export {};
