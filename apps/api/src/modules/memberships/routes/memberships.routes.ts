import { Router } from "express";
import {
  PERMISSIONS,
  updateMembershipRoleSchema,
  updateMembershipStatusSchema,
} from "@aba/shared";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { resolveTenantMiddleware } from "../../../middleware/resolve-tenant.js";
import { requirePermission } from "../../../middleware/authorize.js";
import { validateRequest } from "../../../middleware/validate-request.js";
import {
  listMemberships,
  patchMembershipRole,
  patchMembershipStatus,
} from "../controllers/memberships.controller.js";

export const membershipsRouter = Router();

membershipsRouter.use(
  asyncHandler(authenticateMiddleware),
  asyncHandler(resolveTenantMiddleware)
);

membershipsRouter.get(
  "/",
  requirePermission(PERMISSIONS.TEAM_READ),
  asyncHandler(listMemberships)
);

membershipsRouter.patch(
  "/:userId/role",
  requirePermission(PERMISSIONS.TEAM_UPDATE),
  validateRequest(updateMembershipRoleSchema),
  asyncHandler(patchMembershipRole)
);

membershipsRouter.patch(
  "/:userId/status",
  requirePermission(PERMISSIONS.TEAM_REMOVE),
  validateRequest(updateMembershipStatusSchema),
  asyncHandler(patchMembershipStatus)
);
