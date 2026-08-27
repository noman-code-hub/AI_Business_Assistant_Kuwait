import {
  AppError,
  Role,
  TenantStatus,
  EntityStatus,
  createBusinessOnboardingSchema,
  type CreateBusinessOnboardingInput,
  type BusinessSummary,
  type Tenant,
  type BusinessMember,
} from "@aba/shared";
import { getDb, FieldValue, TopLevel, membershipId, tenantCollection } from "../../../db/index.js";
import { businessRepository } from "../../../repositories/business.repository.js";
import { businessMemberRepository } from "../../../repositories/business-member.repository.js";
import { auditLogRepository } from "../../../repositories/ops.repository.js";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parseOnboarding(raw: unknown): CreateBusinessOnboardingInput {
  const parsed = createBusinessOnboardingSchema.safeParse(raw);
  if (!parsed.success) {
    throw AppError.validation(
      "Validation failed",
      parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
    );
  }
  return parsed.data;
}

export type CreatedBusinessResult = {
  business: Tenant;
  membership: BusinessMember;
  serviceIds: string[];
  tenantId: string;
};

/**
 * Creates tenant (= business), owner membership, and initial services atomically via batch.
 * tenantId is always the Firestore document id — never accepted from the client.
 */
export async function createBusinessForOwner(
  userId: string,
  rawInput: unknown,
  options?: { idempotencyKey?: string }
): Promise<CreatedBusinessResult> {
  if (!userId) throw AppError.unauthorized();

  const input = parseOnboarding(rawInput);
  const db = getDb();

  if (options?.idempotencyKey) {
    const idemRef = db.collection("idempotency").doc(`${userId}_${options.idempotencyKey}`);
    const existing = await idemRef.get();
    if (existing.exists) {
      const cached = existing.data() as CreatedBusinessResult | undefined;
      if (cached?.tenantId && cached.business && cached.membership) {
        return cached;
      }
    }
  }

  const tenantRef = db.collection(TopLevel.tenants).doc();
  const tenantId = tenantRef.id;
  const slugBase = slugify(input.name) || "business";
  const slug = `${slugBase}-${tenantId.slice(0, 6)}`;

  const membershipDocId = membershipId(userId, tenantId);
  const membershipRef = db.collection(TopLevel.tenantMemberships).doc(membershipDocId);

  const now = FieldValue.serverTimestamp();
  const batch = db.batch();

  batch.set(tenantRef, {
    id: tenantId,
    name: input.name,
    slug,
    description: input.description ?? null,
    logoUrl: input.logoUrl ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    website: input.website ?? null,
    address: input.address ?? null,
    governorate: input.governorate ?? null,
    country: input.country,
    vertical: input.vertical,
    customVerticalLabel: input.customVerticalLabel ?? null,
    status: TenantStatus.TRIAL,
    locale: input.locale,
    timezone: input.timezone,
    currency: input.currency,
    ownerUid: userId,
    planId: "trial",
    workingHours: input.workingHours,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  batch.set(membershipRef, {
    id: membershipDocId,
    userId,
    tenantId,
    role: Role.OWNER,
    status: "active",
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const serviceIds: string[] = [];
  for (const service of input.services) {
    const serviceRef = db.collection(tenantCollection(tenantId, "services")).doc();
    serviceIds.push(serviceRef.id);
    batch.set(serviceRef, {
      id: serviceRef.id,
      tenantId,
      name: service.name,
      description: service.description ?? null,
      price: { amount: service.price, currency: "KWD" },
      durationMinutes: service.durationMinutes,
      status: EntityStatus.ACTIVE,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  await batch.commit();

  const business = (await businessRepository.getById(tenantId))!;
  const membership = (await businessMemberRepository.get(userId, tenantId))!;

  try {
    await auditLogRepository.append(tenantId, {
      actorUserId: userId,
      action: "business.created",
      resourceType: "tenant",
      resourceId: tenantId,
      metadata: { serviceCount: serviceIds.length, vertical: input.vertical },
    });
  } catch {
    // Audit failure must not roll back business creation
  }

  const result: CreatedBusinessResult = {
    business,
    membership,
    serviceIds,
    tenantId,
  };

  if (options?.idempotencyKey) {
    const idemRef = db.collection("idempotency").doc(`${userId}_${options.idempotencyKey}`);
    await idemRef.set({
      ...result,
      createdAt: FieldValue.serverTimestamp(),
      userId,
    });
  }

  return result;
}

export async function listBusinessesForUser(userId: string): Promise<BusinessSummary[]> {
  const memberships = await businessMemberRepository.listByUser(userId);
  const summaries: BusinessSummary[] = [];

  await Promise.all(
    memberships.map(async (m: { tenantId: string; role: string }) => {
      const tenant = await businessRepository.getById(m.tenantId);
      if (!tenant) return;
      summaries.push({
        id: tenant.id,
        name: tenant.name,
        logoUrl: tenant.logoUrl ?? null,
        vertical: tenant.vertical,
        role: m.role,
      });
    })
  );

  return summaries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBusinessForMember(
  userId: string,
  businessId: string
): Promise<{ business: Tenant; membership: BusinessMember }> {
  const membership = await businessMemberRepository.getActiveMembership(userId, businessId);
  if (!membership) {
    throw AppError.tenantAccessDenied();
  }
  const business = await businessRepository.getById(businessId);
  if (!business) {
    throw AppError.tenantAccessDenied();
  }
  return { business, membership };
}
