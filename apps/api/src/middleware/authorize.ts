import type { NextFunction, Request, Response } from "express";
import type { Role } from "@aba/shared";
import { AppError, Role as Roles } from "@aba/shared";

const ROLE_RANK: Record<Role, number> = {
  [Roles.READONLY]: 1,
  [Roles.STAFF]: 2,
  [Roles.MANAGER]: 3,
  [Roles.ADMIN]: 4,
  [Roles.OWNER]: 5,
};

export function authorize(minRole: Role = Roles.STAFF) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const role = res.locals.role ?? Roles.OWNER;

    if ((ROLE_RANK[role] ?? 0) < ROLE_RANK[minRole]) {
      next(AppError.forbidden("Insufficient permissions"));
      return;
    }

    next();
  };
}
