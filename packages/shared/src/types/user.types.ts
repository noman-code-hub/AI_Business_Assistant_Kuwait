import type { Role } from "../constants/roles.js";
import type { EntityStatus } from "../constants/statuses.js";
import type { Timestamps } from "./common.types.js";

export type TenantUser = Timestamps & {
  id: string;
  tenantId: string;
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  status: EntityStatus;
};
