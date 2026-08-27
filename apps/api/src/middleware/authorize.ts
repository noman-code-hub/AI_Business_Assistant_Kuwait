import type { NextFunction, Request, Response } from "express";
import type { Permission, Role } from "@aba/shared";
import {
  AppError,
  Role as Roles,
  hasPermission,
  hasAnyPermission,
  normalizeRole,
} from "@aba/shared";

/**
 * Require a single permission (primary Phase 4 authorization).
 * Must run after authenticate + resolveTenant.
 */
export function requirePermission(permission: Permission) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    if (!res.locals.user?.uid) {
      next(AppError.unauthorized());
      return;
    }
    if (!res.locals.tenantId) {
      next(AppError.tenantRequired());
      return;
    }

    const role = normalizeRole(res.locals.role) ?? null;
    if (!role) {
      next(AppError.permissionDenied());
      return;
    }

    if (!hasPermission(role, permission)) {
      next(AppError.permissionDenied());
      return;
    }

    next();
  };
}

/** Allow if the membership role has any of the listed permissions. */
export function requireAnyPermission(permissions: readonly Permission[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    if (!res.locals.user?.uid) {
      next(AppError.unauthorized());
      return;
    }
    if (!res.locals.tenantId) {
      next(AppError.tenantRequired());
      return;
    }

    const role = normalizeRole(res.locals.role) ?? null;
    if (!role || !hasAnyPermission(role, permissions)) {
      next(AppError.permissionDenied());
      return;
    }

    next();
  };
}

/**
 * @deprecated Prefer requirePermission. Coarse role-rank gate kept for compatibility.
 */
export function authorizeRole(allowed: readonly Role[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const role = normalizeRole(res.locals.role);
    if (!role || !allowed.includes(role)) {
      next(AppError.permissionDenied());
      return;
    }
    next();
  };
}

/** @deprecated Use requirePermission — rank-based authorize is not permission-aware. */
export function authorize(minRole: Role = Roles.STAFF) {
  const RANK: Record<Role, number> = {
    [Roles.VIEWER]: 1,
    [Roles.RECEPTIONIST]: 2,
    [Roles.ACCOUNTANT]: 2,
    [Roles.STAFF]: 3,
    [Roles.MANAGER]: 4,
    [Roles.ADMIN]: 5,
    [Roles.OWNER]: 6,
  };

  return (_req: Request, res: Response, next: NextFunction): void => {
    const role = normalizeRole(res.locals.role) ?? Roles.VIEWER;
    if ((RANK[role] ?? 0) < (RANK[minRole] ?? 0)) {
      next(AppError.permissionDenied());
      return;
    }
    next();
  };
}
