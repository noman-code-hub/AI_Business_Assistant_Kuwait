import { Router } from "express";
import { PERMISSIONS } from "@aba/shared";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { resolveTenantMiddleware } from "../../../middleware/resolve-tenant.js";
import { requirePermission } from "../../../middleware/authorize.js";
import { createService, listServices } from "../controllers/services.controller.js";

export const servicesRouter = Router();

servicesRouter.use(asyncHandler(authenticateMiddleware), asyncHandler(resolveTenantMiddleware));

servicesRouter.get(
  "/",
  requirePermission(PERMISSIONS.SERVICES_READ),
  asyncHandler(listServices)
);
servicesRouter.post(
  "/",
  requirePermission(PERMISSIONS.SERVICES_CREATE),
  asyncHandler(createService)
);
