import { useEffect, useState } from "react";
import { useTenant } from "@/app/providers/tenant-provider";
import {
  createCustomer,
  subscribeCustomers,
  type CreateCustomerInput,
  type CustomerDoc,
} from "@/services/firestore";

export function useCustomers() {
  const { tenant, loading: tenantLoading } = useTenant();
  const [customers, setCustomers] = useState<CustomerDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenantLoading) return;
    if (!tenant) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeCustomers(
      tenant.id,
      (items) => {
        setCustomers(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [tenant, tenantLoading]);

  async function addCustomer(input: CreateCustomerInput) {
    if (!tenant) throw new Error("No active tenant");
    return createCustomer(tenant.id, input);
  }

  return {
    customers,
    loading: tenantLoading || loading,
    error,
    addCustomer,
    tenantId: tenant?.id ?? null,
  };
}
