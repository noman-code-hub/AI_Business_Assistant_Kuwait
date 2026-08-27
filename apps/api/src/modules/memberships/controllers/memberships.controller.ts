import type { Request, Response } from "express";
import { AppError, normalizeRole } from "@aba/shared";
import { sendSuccess } from "../../../lib/api-response.js";
import {
  listTenantMemberships,
  updateMemberRole,
  updateMemberStatus,
} from "../services/memberships.service.js";

function authz(res: Response) {
  const userId = res.locals.user?.uid;
  const tenantId = res.locals.tenantId;
  const role = normalizeRole(res.locals.role);
  if (!userId || !tenantId || !role) {
    throw AppError.unauthorized();
  }
  return { userId, tenantId, role };
}

export async function listMemberships(_req: Request, res: Response): Promise<void> {
  const { tenantId } = authz(res);
  const members = await listTenantMemberships(tenantId);
  sendSuccess(res, { memberships: members, tenantId });
}

export async function patchMembershipRole(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const targetUserId = String(req.params.userId ?? "").trim();
  if (!targetUserId) throw AppError.validation("userId is required");

  const role = String((req.body as { role?: string }).role ?? "");
  // Ignore any client-supplied "permissions" field entirely.
  const membership = await updateMemberRole(ctx, targetUserId, role);
  sendSuccess(res, { membership });
}

export async function patchMembershipStatus(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const targetUserId = String(req.params.userId ?? "").trim();
  if (!targetUserId) throw AppError.validation("userId is required");

  const status = (req.body as { status?: string }).status;
  if (status !== "active" && status !== "suspended" && status !== "removed") {
    throw AppError.validation("status must be active, suspended, or removed");
  }

  const membership = await updateMemberStatus(ctx, targetUserId, status);
  sendSuccess(res, { membership });
}
