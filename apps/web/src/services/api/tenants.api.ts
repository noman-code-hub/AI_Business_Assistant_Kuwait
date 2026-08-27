import { apiFetch } from "./client";
import type { BusinessSummary, CreateBusinessOnboardingInput, Tenant, TenantMembership } from "@aba/shared";

export async function listMyBusinesses(): Promise<BusinessSummary[]> {
  const data = await apiFetch<{ businesses: BusinessSummary[] }>("/tenants", {
    skipTenantHeader: true,
  });
  return data.businesses;
}

export async function createBusiness(
  payload: CreateBusinessOnboardingInput,
  idempotencyKey: string
): Promise<{
  tenantId: string;
  business: Tenant;
  membership: TenantMembership;
  serviceIds: string[];
}> {
  return apiFetch("/tenants", {
    method: "POST",
    body: payload,
    skipTenantHeader: true,
    idempotencyKey,
  });
}

export async function getBusiness(businessId: string): Promise<{
  business: Tenant;
  membership: TenantMembership;
  tenantId: string;
}> {
  return apiFetch(`/tenants/${businessId}`, { skipTenantHeader: true });
}
