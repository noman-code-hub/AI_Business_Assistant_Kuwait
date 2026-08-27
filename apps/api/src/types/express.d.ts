import type { Role } from "@aba/shared";

export type AuthenticatedUser = {
  uid: string;
  email?: string;
  emailVerified?: boolean;
};

/** Trusted request authorization context (never accept role/permissions from the client). */
export type RequestContext = {
  requestId: string;
  user?: AuthenticatedUser;
  tenantId?: string;
  membershipId?: string;
  role?: Role;
};

declare global {
  namespace Express {
    interface Locals {
      requestId: string;
      user?: AuthenticatedUser;
      tenantId?: string;
      membershipId?: string;
      role?: Role;
      startedAt: number;
    }
  }
}

export {};
