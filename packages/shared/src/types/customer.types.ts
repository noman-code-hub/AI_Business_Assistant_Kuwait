import type { SoftDelete, Timestamps } from "./common.types.js";
import type { EntityStatus } from "../constants/statuses.js";

export type Customer = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    name: string;
    fullName?: string;
    email?: string;
    phone?: string;
    notes?: string;
    tags?: string[];
    status: EntityStatus;
    source?: "manual" | "whatsapp" | "booking" | "import";
  };
