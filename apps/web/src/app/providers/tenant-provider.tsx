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
import { useAuth } from "@/app/providers/auth-provider";
import {
  ensureUserProfile,
  ensureUserTenant,
  type MembershipDoc,
  type TenantDoc,
  type UserProfileDoc,
} from "@/services/firestore";

function mapFirestoreError(err: unknown): string {
  if (err instanceof FirebaseError) {
    if (err.code === "permission-denied") {
      return "Firestore blocked the write (permission-denied). Publish firebase/firestore.rules in Firebase Console → Firestore → Rules, then click Retry.";
    }
    if (err.code === "failed-precondition") {
      return "Firestore needs an index for this query. Open the link in the browser console error, create the index, then retry.";
    }
    return `${err.code}: ${err.message}`;
  }
  if (err instanceof Error) return err.message;
  return "Failed to load workspace from Firestore";
}

type TenantContextValue = {
  profile: UserProfileDoc | null;
  tenant: TenantDoc | null;
  membership: MembershipDoc | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);
  const [tenant, setTenant] = useState<TenantDoc | null>(null);
  const [membership, setMembership] = useState<MembershipDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bootstrap = useCallback(async () => {
    if (!firebaseUser) {
      setProfile(null);
      setTenant(null);
      setMembership(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nextProfile = await ensureUserProfile(firebaseUser);
      const { tenant: nextTenant, membership: nextMembership } =
        await ensureUserTenant(firebaseUser);
      setProfile(nextProfile);
      setTenant(nextTenant);
      setMembership(nextMembership);
    } catch (err) {
      setError(mapFirestoreError(err));
      setProfile(null);
      setTenant(null);
      setMembership(null);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (authLoading) return;
    void bootstrap();
  }, [authLoading, bootstrap]);

  const value = useMemo(
    () => ({
      profile,
      tenant,
      membership,
      loading: authLoading || loading,
      error,
      refresh: bootstrap,
    }),
    [profile, tenant, membership, authLoading, loading, error, bootstrap]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}
