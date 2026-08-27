import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  type Permission,
  type Role,
  hasPermission,
  permissionsForRole,
  normalizeRole,
} from "@aba/shared";
import { useTenant } from "@/app/providers/tenant-provider";

type PermissionsContextValue = {
  role: Role | null;
  permissions: readonly Permission[];
  /** UX-only permission check — backend still enforces. */
  can: (permission: Permission) => boolean;
  canAny: (permissions: readonly Permission[]) => boolean;
  canAll: (permissions: readonly Permission[]) => boolean;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

/**
 * Derives permissions from the active business membership role.
 * Recomputes on business switch — never retains previous tenant permissions.
 */
export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { membershipRole, tenantId } = useTenant();

  const value = useMemo<PermissionsContextValue>(() => {
    // Recompute whenever active business changes, even if role string is identical.
    void tenantId;
    const role = normalizeRole(membershipRole);
    const permissions = permissionsForRole(role);
    return {
      role,
      permissions,
      can: (permission) => hasPermission(role, permission),
      canAny: (list) => list.some((p) => hasPermission(role, p)),
      canAll: (list) => list.every((p) => hasPermission(role, p)),
    };
  }, [membershipRole, tenantId]);

  return (
    <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextValue {
  const ctx = useContext(PermissionsContext);
  if (!ctx) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }
  return ctx;
}

/** Convenience: can("customers.create") without pulling full context object. */
export function useCan() {
  return usePermissions().can;
}
