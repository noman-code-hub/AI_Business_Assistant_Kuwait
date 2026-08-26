import type { SoftDelete, Timestamps } from "./common.types.js";
import type { Vertical } from "../constants/verticals.js";
import type { TenantStatus } from "../constants/statuses.js";
import type { Locale } from "../constants/locales.js";

export type Tenant = Timestamps &
  SoftDelete & {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    country: string;
    vertical: Vertical;
    status: TenantStatus;
    locale: Locale;
    timezone: string;
    currency: "KWD";
    ownerUid: string;
    planId?: string;
  };

/** Alias for Phase 1 brief — canonical collection is `tenants`. */
export type Business = Tenant;
