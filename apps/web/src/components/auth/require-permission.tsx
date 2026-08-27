import { Navigate } from "react-router-dom";
import type { Permission } from "@aba/shared";
import { usePermissions } from "@/app/providers/permissions-provider";
import { useTenant } from "@/app/providers/tenant-provider";
import { Spinner } from "@/components/feedback/spinner";

/**
 * UX route guard only — backend must still enforce requirePermission.
 */
export function RequirePermission({
  permission,
  anyOf,
  children,
  fallback = "/app/dashboard",
}: {
  permission?: Permission;
  anyOf?: readonly Permission[];
  children: React.ReactNode;
  fallback?: string;
}) {
  const { loading } = useTenant();
  const { can, canAny } = usePermissions();

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const allowed = permission
    ? can(permission)
    : anyOf
      ? canAny(anyOf)
      : false;

  if (!allowed) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
