import { useCallback, useEffect, useState } from "react";
import type { CustomerDetailResponse } from "@aba/shared";
import { useTenant } from "@/app/providers/tenant-provider";
import { fetchCustomerDetail } from "@/services/api/customers.api";
import { ApiClientError } from "@/services/api/client";

export function useCustomerDetail(customerId: string | undefined) {
  const { tenantId } = useTenant();
  const [detail, setDetail] = useState<CustomerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tenantId || !customerId) {
      setDetail(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerDetail(tenantId, customerId);
      setDetail(data);
    } catch (err) {
      setDetail(null);
      setError(err instanceof ApiClientError ? err.message : "Unable to load customer.");
    } finally {
      setLoading(false);
    }
  }, [tenantId, customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { detail, loading, error, refresh: load, tenantId };
}
