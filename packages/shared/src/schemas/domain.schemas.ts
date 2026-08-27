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

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  status: entityStatusSchema.default(EntityStatus.ACTIVE),
});

export const updateCustomerSchema = createCustomerSchema.partial();

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
