import { z } from "zod";
import { Role } from "../constants/roles.js";
import { Vertical } from "../constants/verticals.js";
import { Locale } from "../constants/locales.js";
import { TenantStatus, EntityStatus } from "../constants/statuses.js";

export const roleSchema = z.nativeEnum(Role);
export const verticalSchema = z.nativeEnum(Vertical);
export const localeSchema = z.nativeEnum(Locale);
export const tenantStatusSchema = z.nativeEnum(TenantStatus);
export const entityStatusSchema = z.nativeEnum(EntityStatus);

export const createTenantSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  vertical: verticalSchema,
  locale: localeSchema.default(Locale.EN),
});

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  status: entityStatusSchema.default(EntityStatus.ACTIVE),
});

export const updateCustomerSchema = createCustomerSchema.partial();
