import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FirebaseError } from "firebase/app";
import type { BusinessSummary } from "@aba/shared";
import { useAuth } from "@/app/providers/auth-provider";
import { ensureUserProfile, type UserProfileDoc } from "@/services/firestore";
import { listMyBusinesses } from "@/services/api/tenants.api";
import { ApiClientError } from "@/services/api/client";
import { getStoredActiveTenantId, setStoredActiveTenantId } from "@/services/api/client";

function mapError(err: unknown): string {
  if (err instanceof ApiClientError) {
    if (err.code === "UNAUTHORIZED" || err.status === 401) {
      return "API authentication failed. Ensure the API is running and Firebase Admin is configured.";
    }
    return err.message;
  }
  if (err instanceof FirebaseError) {
    if (err.code === "permission-denied") {
      return "Firestore permission denied. Publish firebase/firestore.rules, then retry.";
    }
    return `${err.code}: ${err.message}`;
  }
  if (err instanceof Error) return err.message;
  return "Failed to load businesses";
}

type TenantContextValue = {
  profile: UserProfileDoc | null;
  businesses: BusinessSummary[];
  /** Active tenant id (canonical business id). */
  tenantId: string | null;
  tenant: BusinessSummary | null;
  membershipRole: string | null;
  loading: boolean;
  error: string | null;
  needsOnboarding: boolean;
  refresh: () => Promise<void>;
  switchBusiness: (businessId: string) => Promise<void>;
};

const TenantContext = createContext<TenantContextValue | null>(null);

function pickActiveId(businesses: BusinessSummary[], preferred: string | null): string | null {
  if (!businesses.length) return null;
  if (preferred && businesses.some((b) => b.id === preferred)) return preferred;
  return businesses[0]!.id;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bootstrap = useCallback(async () => {
    if (!firebaseUser) {
      setProfile(null);
      setBusinesses([]);
      setTenantId(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Load businesses from API first — do not block on Firestore profile sync.
      const listPromise = listMyBusinesses();
      const profilePromise = ensureUserProfile(firebaseUser).catch((profileErr) => {
        console.warn("User profile sync skipped:", profileErr);
        return null;
      });

      const [list, nextProfile] = await Promise.all([listPromise, profilePromise]);
      setProfile(nextProfile);
      setBusinesses(list);
      // Prefer last selection from localStorage only if user still has membership
      const active = pickActiveId(list, getStoredActiveTenantId());
      setTenantId(active);
      setStoredActiveTenantId(active);
    } catch (err) {
      setError(mapError(err));
      setBusinesses([]);
      setTenantId(null);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (authLoading) return;
    void bootstrap();
  }, [authLoading, bootstrap]);

  const switchBusiness = useCallback(
    async (businessId: string) => {
      const target = businesses.find((b) => b.id === businessId);
      if (!target) {
        throw new Error("You do not have access to this business.");
      }
      setTenantId(businessId);
      setStoredActiveTenantId(businessId);
    },
    [businesses]
  );

  const tenant = useMemo(
    () => businesses.find((b) => b.id === tenantId) ?? null,
    [businesses, tenantId]
  );

  const value = useMemo<TenantContextValue>(
    () => ({
      profile,
      businesses,
      tenantId,
      tenant,
      membershipRole: tenant?.role ?? null,
      loading: authLoading || loading,
      error,
      needsOnboarding: !authLoading && !loading && !error && businesses.length === 0,
      refresh: bootstrap,
      switchBusiness,
    }),
    [
      profile,
      businesses,
      tenantId,
      tenant,
      authLoading,
      loading,
      error,
      bootstrap,
      switchBusiness,
    ]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
