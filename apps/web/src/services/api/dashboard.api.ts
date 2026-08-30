import type {
  DashboardRevenueRange,
  DashboardRevenueResponse,
  DashboardSummaryResponse,
} from "@aba/shared";
import { apiFetch } from "./client";

export function fetchDashboardSummary(tenantId: string | null): Promise<DashboardSummaryResponse> {
  return apiFetch<DashboardSummaryResponse>("/dashboard/summary", { tenantId });
}

export function fetchDashboardRevenue(
  tenantId: string | null,
  range: DashboardRevenueRange
): Promise<DashboardRevenueResponse> {
  return apiFetch<DashboardRevenueResponse>(`/dashboard/revenue?range=${range}`, { tenantId });
}
