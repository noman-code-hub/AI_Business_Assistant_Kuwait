import { Router } from "express";
import { PERMISSIONS } from "@aba/shared";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { resolveTenantMiddleware } from "../../../middleware/resolve-tenant.js";
import { requirePermission } from "../../../middleware/authorize.js";
import {
  fetchDashboardRevenue,
  fetchDashboardSummary,
} from "../controllers/dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.use(asyncHandler(authenticateMiddleware), asyncHandler(resolveTenantMiddleware));

dashboardRouter.get(
  "/summary",
  requirePermission(PERMISSIONS.DASHBOARD_READ),
  asyncHandler(fetchDashboardSummary)
);

dashboardRouter.get(
  "/revenue",
  requirePermission(PERMISSIONS.PAYMENTS_READ),
  asyncHandler(fetchDashboardRevenue)
);
