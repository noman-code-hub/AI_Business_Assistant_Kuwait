import { Router } from "express";
import { PERMISSIONS } from "@aba/shared";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { resolveTenantMiddleware } from "../../../middleware/resolve-tenant.js";
import { requirePermission } from "../../../middleware/authorize.js";
import {
  createCustomer,
  getCustomer,
  listCustomers,
} from "../controllers/customers.controller.js";

export const customersRouter = Router();

customersRouter.use(asyncHandler(authenticateMiddleware), asyncHandler(resolveTenantMiddleware));

customersRouter.get(
  "/",
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  asyncHandler(listCustomers)
);
customersRouter.post(
  "/",
  requirePermission(PERMISSIONS.CUSTOMERS_CREATE),
  asyncHandler(createCustomer)
);
customersRouter.get(
  "/:customerId",
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  asyncHandler(getCustomer)
);
