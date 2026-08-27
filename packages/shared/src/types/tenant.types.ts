import type { SoftDelete, Timestamps } from "./common.types.js";
import type { Vertical } from "../constants/verticals.js";
import type { TenantStatus } from "../constants/statuses.js";
import type { Locale } from "../constants/locales.js";
import type { Weekday } from "../constants/kuwait.js";

export type { Weekday, KuwaitGovernorate } from "../constants/kuwait.js";

export type DayWorkingHours = {
  enabled: boolean;
  open?: string | null;
  close?: string | null;
};

export type WorkingHours = Record<Weekday, DayWorkingHours>;

export type Tenant = Timestamps &
  SoftDelete & {
    id: string;
    /** Canonical tenant identity — same as document id. */
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    governorate?: string;
    country: string;
    vertical: Vertical;
    /** When vertical is `other`. */
    customVerticalLabel?: string;
    status: TenantStatus;
    locale: Locale;
    timezone: string;
    currency: string;
    ownerUid: string;
    planId?: string;
    workingHours?: WorkingHours;
  };

/** Alias for Phase 1 brief — canonical collection is `tenants`. */
export type Business = Tenant;

/** Lightweight row for business switcher. */
export type BusinessSummary = {
  id: string;
  name: string;
  logoUrl?: string | null;
  vertical: Vertical;
  role: string;
};
