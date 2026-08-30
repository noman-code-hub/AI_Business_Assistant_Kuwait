import { useCallback, useEffect, useState } from "react";
import type { CreateCustomerInput, Customer, CustomerListResponse, UpdateCustomerInput } from "@aba/shared";
import { useTenant } from "@/app/providers/tenant-provider";
import {
  createCustomerApi,
  deleteCustomerApi,
  fetchCustomers,
  type CustomerListParams,
} from "@/services/api/customers.api";
import { ApiClientError } from "@/services/api/client";

type CustomersState = {
  customers: Customer[];
  pagination: CustomerListResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
  params: CustomerListParams;
  setParams: (patch: Partial<CustomerListParams>) => void;
  refresh: () => Promise<void>;
  createCustomer: (input: CreateCustomerInput) => Promise<Customer>;
  updateCustomer: (id: string, input: UpdateCustomerInput) => Promise<Customer>;
  removeCustomer: (id: string) => Promise<void>;
};

const DEFAULT_PARAMS: CustomerListParams = {
  page: 1,
  pageSize: 20,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useCustomers(initialParams: Partial<CustomerListParams> = {}): CustomersState {
  const { tenantId } = useTenant();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<CustomerListResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParamsState] = useState<CustomerListParams>({
    ...DEFAULT_PARAMS,
    ...initialParams,
  });

  const setParams = useCallback((patch: Partial<CustomerListParams>) => {
    setParamsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const load = useCallback(async () => {
    if (!tenantId) {
      setCustomers([]);
      setPagination(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers(tenantId, params);
      setCustomers(data.customers);
      setPagination(data.pagination);
    } catch (err) {
      setCustomers([]);
      setPagination(null);
      setError(err instanceof ApiClientError ? err.message : "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }, [tenantId, params]);

  useEffect(() => {
    void load();
  }, [load]);

  const createCustomer = useCallback(
    async (input: CreateCustomerInput) => {
      if (!tenantId) throw new Error("No active business");
      const { customer } = await createCustomerApi(tenantId, input);
      await load();
      return customer;
    },
    [tenantId, load]
  );

  const updateCustomer = useCallback(
    async (id: string, input: UpdateCustomerInput) => {
      if (!tenantId) throw new Error("No active business");
      const { updateCustomerApi } = await import("@/services/api/customers.api");
      const { customer } = await updateCustomerApi(tenantId, id, input);
      await load();
      return customer;
    },
    [tenantId, load]
  );

  const removeCustomer = useCallback(
    async (id: string) => {
      if (!tenantId) throw new Error("No active business");
      await deleteCustomerApi(tenantId, id);
      await load();
    },
    [tenantId, load]
  );

  return {
    customers,
    pagination,
    loading,
    error,
    params,
    setParams,
    refresh: load,
    createCustomer,
    updateCustomer,
    removeCustomer,
  };
}
