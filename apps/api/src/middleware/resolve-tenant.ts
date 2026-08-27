import type { NextFunction, Request, Response } from "express";
import { AppError, normalizeRole } from "@aba/shared";
import { businessMemberRepository } from "../repositories/business-member.repository.js";
import { businessRepository } from "../repositories/business.repository.js";
import { isFirebaseAdminConfigured } from "../services/firebase/admin.js";
import { appConfig } from "../config/index.js";
import { membershipId } from "../db/collections.js";

/**
 * Resolves trusted tenantId + membership role after verifying ACTIVE membership.
 * Never trusts client-supplied role, permissions, or tenantId alone.
 */
export async function resolveTenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.header("X-Tenant-Id")?.trim();
    if (!tenantId) {
      next(AppError.tenantRequired());
      return;
    }

    const user = res.locals.user;
    if (!user?.uid) {
      next(AppError.unauthorized());
      return;
    }

    // Local stub when Admin is not configured (dev-token path).
    if (appConfig.isLocal && user.uid === "dev-user" && !isFirebaseAdminConfigured()) {
      res.locals.tenantId = tenantId;
      res.locals.membershipId = membershipId(user.uid, tenantId);
      res.locals.role = "owner";
      next();
      return;
    }

    if (!isFirebaseAdminConfigured()) {
      next(AppError.internal("Firebase Admin is required to resolve tenant membership"));
      return;
    }

    const membership = await businessMemberRepository.getActiveMembership(user.uid, tenantId);
    if (!membership) {
      next(AppError.tenantAccessDenied());
      return;
    }

    const role = normalizeRole(membership.role);
    if (!role) {
      next(AppError.tenantAccessDenied("Membership role is invalid."));
      return;
    }

    const tenant = await businessRepository.getById(tenantId);
    if (!tenant) {
      next(AppError.notFound("tenant"));
      return;
    }
    if (tenant.status === "suspended") {
      next(AppError.tenantSuspended());
      return;
    }

    res.locals.tenantId = tenantId;
    res.locals.membershipId = membership.id;
    res.locals.role = role;
    next();
  } catch (err) {
    next(err);
  }
}
