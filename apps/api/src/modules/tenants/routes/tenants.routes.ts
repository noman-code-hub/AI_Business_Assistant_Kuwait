import { Router } from "express";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { validateRequest } from "../../../middleware/validate-request.js";
import { createBusinessOnboardingSchema } from "@aba/shared";
import { createBusiness, getBusiness, listMyBusinesses } from "../controllers/tenants.controller.js";

export const tenantsRouter = Router();

/** Auth only — no X-Tenant-Id. Creates business + OWNER membership. */
tenantsRouter.post(
  "/",
  asyncHandler(authenticateMiddleware),
  validateRequest(createBusinessOnboardingSchema),
  asyncHandler(createBusiness)
);

/** List businesses the authenticated user belongs to. */
tenantsRouter.get(
  "/",
  asyncHandler(authenticateMiddleware),
  asyncHandler(listMyBusinesses)
);

/** Membership-gated business fetch. */
tenantsRouter.get(
  "/:businessId",
  asyncHandler(authenticateMiddleware),
  asyncHandler(getBusiness)
);
