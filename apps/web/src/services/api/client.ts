/**
 * API client for Express (`apps/api`).
 *
 * localStorage usage (Phase 3):
 * - Only stores the *preferred* active tenant id for UX (header switcher / X-Tenant-Id).
 * - NOT a database — membership is always re-validated on the server.
 * - Never store secrets, tokens, or business records here.
 */
import { auth } from "@/lib/firebase";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8080/api/v1";

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ path?: string; message: string }>;
  };
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiErrorBody["error"]["details"];

  constructor(status: number, code: string, message: string, details?: ApiErrorBody["error"]["details"]) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** localStorage key for the last selected business/tenant (UI preference only). */
const ACTIVE_TENANT_KEY = "aba:activeTenantId";

/** Read preferred tenant id from localStorage (may be invalid — server still checks membership). */
export function getStoredActiveTenantId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_TENANT_KEY);
  } catch {
    // Private mode / blocked storage
    return null;
  }
}

/** Persist or clear preferred tenant id in localStorage after switch / create / logout. */
export function setStoredActiveTenantId(tenantId: string | null): void {
  try {
    if (!tenantId) localStorage.removeItem(ACTIVE_TENANT_KEY);
    else localStorage.setItem(ACTIVE_TENANT_KEY, tenantId);
  } catch {
    // ignore quota / privacy errors — app still works with in-memory tenant
  }
}

export async function apiFetch<T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    tenantId?: string | null;
    idempotencyKey?: string;
    skipTenantHeader?: boolean;
  }
): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiClientError(401, "UNAUTHORIZED", "Authentication required");
  }

  const token = await user.getIdToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  if (!options?.skipTenantHeader) {
    const tenantId = options?.tenantId ?? getStoredActiveTenantId();
    if (tenantId) headers["X-Tenant-Id"] = tenantId;
  }

  if (options?.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  const res = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    method: options?.method ?? (options?.body ? "POST" : "GET"),
    headers,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const json = (await res.json().catch(() => null)) as
    | { success: true; data: T }
    | ApiErrorBody
    | null;

  if (!res.ok || !json || json.success === false) {
    const err = json && "error" in json ? json.error : null;
    throw new ApiClientError(
      res.status,
      err?.code ?? "INTERNAL_ERROR",
      err?.message ?? `Request failed (${res.status})`,
      err?.details
    );
  }

  return json.data;
}
