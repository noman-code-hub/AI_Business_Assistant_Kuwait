import type { Role } from "../constants/roles.js";
import type { Locale } from "../constants/locales.js";
import type { SoftDelete, Timestamps } from "./common.types.js";
import type { UserProfileStatus } from "../constants/domain-statuses.js";

export type AuthUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
};

export type AuthClaims = {
  tenants?: Record<string, Role>;
};

export type SessionUser = AuthUser & {
  role?: Role;
  tenantId?: string;
  locale?: Locale;
};

/** Application profile in `users/{userId}` — no credentials. */
export type UserProfile = Timestamps &
  SoftDelete & {
    id: string;
    uid?: string;
    email: string | null;
    displayName: string | null;
    phone?: string | null;
    photoURL?: string | null;
    status: UserProfileStatus;
    locale: Locale;
    timezone: string;
    lastLoginAt?: string | null;
  };
