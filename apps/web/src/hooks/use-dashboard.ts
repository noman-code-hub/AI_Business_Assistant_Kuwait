import { useCallback, useEffect, useState } from "react";
import type { DashboardRevenueRange, DashboardRevenueResponse, DashboardSummaryResponse } from "@aba/shared";
import { useTenant } from "@/app/providers/tenant-provider";
import { fetchDashboardRevenue, fetchDashboardSummary } from "@/services/api/dashboard.api";
import { ApiClientError } from "@/services/api/client";

type DashboardState = {
  summary: DashboardSummaryResponse | null;
  revenue: DashboardRevenueResponse | null;
  loading: boolean;
  revenueLoading: boolean;
  error: string | null;
  revenueError: string | null;
  revenueRange: DashboardRevenueRange;
  refresh: () => Promise<void>;
  setRevenueRange: (range: DashboardRevenueRange) => void;
};

export function useDashboard(): DashboardState {
  const { tenantId } = useTenant();
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [revenue, setRevenue] = useState<DashboardRevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revenueError, setRevenueError] = useState<string | null>(null);
  const [revenueRange, setRevenueRange] = useState<DashboardRevenueRange>("7d");

  const loadSummary = useCallback(async () => {
    if (!tenantId) {
      setSummary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardSummary(tenantId);
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(err instanceof ApiClientError ? err.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const loadRevenue = useCallback(async () => {
    if (!tenantId) {
      setRevenue(null);
      return;
    }
    setRevenueLoading(true);
    setRevenueError(null);
    try {
      const data = await fetchDashboardRevenue(tenantId, revenueRange);
      setRevenue(data);
    } catch (err) {
      setRevenue(null);
      if (err instanceof ApiClientError && err.code === "PERMISSION_DENIED") {
        setRevenueError(null);
      } else {
        setRevenueError(
          err instanceof ApiClientError ? err.message : "Unable to load revenue chart."
        );
      }
    } finally {
      setRevenueLoading(false);
    }
  }, [tenantId, revenueRange]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadRevenue();
  }, [loadRevenue]);

  const refresh = useCallback(async () => {
    await Promise.all([loadSummary(), loadRevenue()]);
  }, [loadSummary, loadRevenue]);

  return {
    summary,
    revenue,
    loading,
    revenueLoading,
    error,
    revenueError,
    revenueRange,
    refresh,
    setRevenueRange,
  };
}
