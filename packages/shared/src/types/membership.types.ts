import type { Role } from "../constants/roles.js";
import type { MembershipStatus } from "../constants/domain-statuses.js";
import type { SoftDelete, Timestamps } from "./common.types.js";

/** User ↔ Tenant membership. Doc id: `{userId}_{tenantId}`. */
export type TenantMembership = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    userId: string;
    role: Role;
    status: MembershipStatus;
  };

/** Alias used by Phase 1 brief — canonical type is TenantMembership. */
export type BusinessMember = TenantMembership;
