import { z } from "zod";
import { Role } from "../constants/roles.js";
import { Vertical } from "../constants/verticals.js";
import { Locale } from "../constants/locales.js";
import { TenantStatus, EntityStatus } from "../constants/statuses.js";
import { MembershipStatus } from "../constants/domain-statuses.js";
import { KUWAIT_GOVERNORATES, WEEKDAYS } from "../constants/kuwait.js";

export const roleSchema = z.nativeEnum(Role);
export const verticalSchema = z.nativeEnum(Vertical);
export const localeSchema = z.nativeEnum(Locale);
export const tenantStatusSchema = z.nativeEnum(TenantStatus);
export const entityStatusSchema = z.nativeEnum(EntityStatus);

const timeHm = z
  .string()
  .transform((v) => {
    // Accept `HH:mm` or browser `HH:mm:ss`
    const m = /^(\d{2}):(\d{2})/.exec(v.trim());
    return m ? `${m[1]}:${m[2]}` : v.trim();
  })
  .refine((v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v), "Time must be HH:mm");

export const dayWorkingHoursSchema = z
  .object({
    enabled: z.boolean(),
    open: timeHm.nullable().optional(),
    close: timeHm.nullable().optional(),
  })
  .superRefine((day, ctx) => {
    if (!day.enabled) return;
    if (!day.open) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Open time is required", path: ["open"] });
    }
    if (!day.close) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Close time is required", path: ["close"] });
    }
    if (day.open && day.close && day.close <= day.open) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Close time must be after open time",
        path: ["close"],
      });
    }
  });

export const workingHoursSchema = z.object(
  Object.fromEntries(WEEKDAYS.map((d) => [d, dayWorkingHoursSchema])) as Record<
    (typeof WEEKDAYS)[number],
    typeof dayWorkingHoursSchema
  >
);

export const onboardingServiceSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  price: z.number().finite().nonnegative().max(1_000_000),
  durationMinutes: z.number().int().positive().max(24 * 60),
});

const optionalUrl = z
  .string()
  .trim()
  .url()
  .max(500)
  .optional()
  .or(z.literal("").transform(() => undefined));

/** Logo may be https URL or a local data URL from onboarding (localStorage). */
const optionalLogoUrl = z
  .string()
  .trim()
  .max(900_000)
  .refine(
    (v) =>
      v === "" ||
      v.startsWith("data:image/") ||
      /^https?:\/\//i.test(v),
    "Logo must be an image URL or local image"
  )
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalEmail = z
  .string()
  .trim()
  .email()
  .max(200)
  .optional()
  .or(z.literal("").transform(() => undefined));

/** Kuwait (+965…) or general E.164-ish phone. */
const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .regex(/^\+?[0-9\s()-]{8,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createTenantSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  vertical: verticalSchema,
  locale: localeSchema.default(Locale.EN),
});

/**
 * Full Phase 3 onboarding payload.
 * Server generates tenantId — client must never send a trusted tenantId.
 */
export const createBusinessOnboardingSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
    logoUrl: optionalLogoUrl,
    phone: optionalPhone,
    email: optionalEmail,
    website: optionalUrl,
    address: z.string().trim().max(300).optional().or(z.literal("").transform(() => undefined)),
    governorate: z
      .string()
      .trim()
      .max(80)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    country: z.string().trim().min(2).max(80).default("Kuwait"),
    currency: z
      .string()
      .trim()
      .length(3)
      .transform((v) => v.toUpperCase())
      .default("KWD"),
    timezone: z.string().trim().min(3).max(60).default("Asia/Kuwait"),
    vertical: verticalSchema,
    customVerticalLabel: z.string().trim().max(80).optional().or(z.literal("").transform(() => undefined)),
    locale: localeSchema.default(Locale.EN),
    workingHours: workingHoursSchema,
    services: z.array(onboardingServiceSchema).max(50).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.vertical === Vertical.OTHER && !data.customVerticalLabel?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom business type is required when Other is selected",
        path: ["customVerticalLabel"],
      });
    }
    if (
      data.country.toLowerCase() === "kuwait" &&
      data.governorate &&
      !(KUWAIT_GOVERNORATES as readonly string[]).includes(data.governorate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a valid Kuwait governorate",
        path: ["governorate"],
      });
    }
  });

export type CreateBusinessOnboardingInput = z.infer<typeof createBusinessOnboardingSchema>;

export const customerSourceSchema = z.enum([
  "manual",
  "whatsapp",
  "booking",
  "import",
  "website",
  "ai_assistant",
  "referral",
]);

const customerOptionalEmail = z
  .union([z.string().trim().email().max(254), z.literal("")])
  .optional()
  .transform((v) => (v && v.length > 0 ? v.toLowerCase() : undefined));

const customerOptionalPhone = z
  .union([z.string().trim().max(32), z.literal("")])
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined));

const customerTagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(20)
  .optional()
  .transform((tags) => {
    if (!tags) return undefined;
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of tags) {
      const tag = raw.trim().replace(/\s+/g, " ");
      if (!tag) continue;
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(tag);
    }
    return out;
  });

export const createCustomerSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: customerOptionalEmail,
    phone: customerOptionalPhone,
    whatsapp: customerOptionalPhone,
    address: z
      .union([z.string().trim().max(500), z.literal("")])
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    notes: z
      .union([z.string().trim().max(2000), z.literal("")])
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    tags: customerTagsSchema,
    status: entityStatusSchema.optional().default(EntityStatus.ACTIVE),
    source: customerSourceSchema.optional().default("manual"),
    // Explicitly reject client-controlled ownership fields if present in body parsers.
    tenantId: z.never().optional(),
    id: z.never().optional(),
    createdAt: z.never().optional(),
    updatedAt: z.never().optional(),
  })
  .strict();

export const updateCustomerSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: customerOptionalEmail,
    phone: customerOptionalPhone,
    whatsapp: customerOptionalPhone,
    address: z
      .union([z.string().trim().max(500), z.literal("")])
      .optional()
      .transform((v) => (v === "" ? null : v && v.length > 0 ? v : undefined)),
    notes: z
      .union([z.string().trim().max(2000), z.literal("")])
      .optional()
      .transform((v) => (v === "" ? null : v && v.length > 0 ? v : undefined)),
    tags: customerTagsSchema,
    status: entityStatusSchema.optional(),
    source: customerSourceSchema.optional(),
    tenantId: z.never().optional(),
    id: z.never().optional(),
    createdAt: z.never().optional(),
    updatedAt: z.never().optional(),
  })
  .strict();

export const listCustomersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
  tag: z.string().trim().max(40).optional(),
  source: customerSourceSchema.optional(),
  status: entityStatusSchema.optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const customerIdParamSchema = z.object({
  customerId: z.string().trim().min(1).max(128),
});

/** Max CSV payload size (characters ≈ bytes for ASCII). */
export const CUSTOMER_CSV_MAX_CHARS = 5 * 1024 * 1024;
/** Max data rows per import (excluding header). */
export const CUSTOMER_CSV_MAX_ROWS = 5000;

export const customerImportBodySchema = z.object({
  csv: z.string().min(1).max(CUSTOMER_CSV_MAX_CHARS),
  /** When false/omitted, only validate + preview. When true, create valid non-duplicate rows. */
  confirm: z.boolean().optional().default(false),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
export type CustomerImportBody = z.infer<typeof customerImportBodySchema>;

/** Role change body — OWNER is never assignable via this API. */
export const updateMembershipRoleSchema = z.object({
  role: z
    .nativeEnum(Role)
    .refine((r) => r !== Role.OWNER, "OWNER cannot be assigned via role update"),
});

/** Membership status change (suspend / reactivate / remove). */
export const updateMembershipStatusSchema = z.object({
  status: z.enum([
    MembershipStatus.ACTIVE,
    MembershipStatus.SUSPENDED,
    MembershipStatus.REMOVED,
  ]),
});

export function defaultWorkingHours(): z.infer<typeof workingHoursSchema> {
  const openDays = new Set(["monday", "tuesday", "wednesday", "thursday", "saturday", "sunday"]);
  return Object.fromEntries(
    WEEKDAYS.map((day) => [
      day,
      openDays.has(day)
        ? { enabled: true, open: "09:00", close: "22:00" }
        : { enabled: false, open: null, close: null },
    ])
  ) as z.infer<typeof workingHoursSchema>;
}
