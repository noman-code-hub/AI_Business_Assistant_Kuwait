import type { Request, Response } from "express";
import {
  AppError,
  PERMISSIONS,
  hasPermission,
  normalizeRole,
  type Role,
} from "@aba/shared";
import { sendSuccess } from "../../../lib/api-response.js";
import {
  getDashboardRevenue,
  getDashboardSummary,
  parseRevenueRange,
  type DashboardAccess,
} from "../services/dashboard.service.js";

function buildAccess(role: Role | null): DashboardAccess {
  return {
    canViewFinancials: hasPermission(role, PERMISSIONS.PAYMENTS_READ),
    canViewCustomers: hasPermission(role, PERMISSIONS.CUSTOMERS_READ),
    canViewAppointments: hasPermission(role, PERMISSIONS.APPOINTMENTS_READ),
    canViewInvoices: hasPermission(role, PERMISSIONS.INVOICES_READ),
    canViewActivity:
      hasPermission(role, PERMISSIONS.AUDIT_LOGS_READ) ||
      hasPermission(role, PERMISSIONS.DASHBOARD_READ),
  };
}

function requireTenant(res: Response): string {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();
  return tenantId;
}

function requireRole(res: Response): Role {
  const role = normalizeRole(res.locals.role);
  if (!role) throw AppError.permissionDenied();
  return role;
}

export async function fetchDashboardSummary(_req: Request, res: Response): Promise<void> {
  const tenantId = requireTenant(res);
  const role = requireRole(res);
  const data = await getDashboardSummary(tenantId, buildAccess(role));
  sendSuccess(res, data);
}

export async function fetchDashboardRevenue(req: Request, res: Response): Promise<void> {
  const tenantId = requireTenant(res);
  const role = requireRole(res);
  if (!hasPermission(role, PERMISSIONS.PAYMENTS_READ)) {
    throw AppError.permissionDenied();
  }

  const range = parseRevenueRange(req.query.range);
  if (!range) {
    throw AppError.validation("range must be today, 7d, 30d, or 12m");
  }

  const data = await getDashboardRevenue(tenantId, range);
  sendSuccess(res, data);
}
