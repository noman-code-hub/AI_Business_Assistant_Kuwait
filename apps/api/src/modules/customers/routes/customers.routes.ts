import { Router } from "express";
import {
  PERMISSIONS,
  createCustomerSchema,
  updateCustomerSchema,
  listCustomersQuerySchema,
  customerIdParamSchema,
  customerImportBodySchema,
} from "@aba/shared";
import { asyncHandler } from "../../../lib/async-handler.js";
import { authenticateMiddleware } from "../../../middleware/authenticate.js";
import { resolveTenantMiddleware } from "../../../middleware/resolve-tenant.js";
import { requirePermission } from "../../../middleware/authorize.js";
import { validateRequest } from "../../../middleware/validate-request.js";
import {
  createCustomer,
  deleteCustomer,
  exportCustomersHandler,
  getCustomer,
  getCustomerDetailHandler,
  importCustomers,
  listCustomers,
  updateCustomer,
} from "../controllers/customers.controller.js";

export const customersRouter = Router();

customersRouter.use(asyncHandler(authenticateMiddleware), asyncHandler(resolveTenantMiddleware));

customersRouter.get(
  "/export",
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  asyncHandler(exportCustomersHandler)
);

customersRouter.post(
  "/import",
  requirePermission(PERMISSIONS.CUSTOMERS_CREATE),
  validateRequest(customerImportBodySchema),
  asyncHandler(importCustomers)
);

customersRouter.get(
  "/",
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  validateRequest(listCustomersQuerySchema, "query"),
  asyncHandler(listCustomers)
);

customersRouter.post(
  "/",
  requirePermission(PERMISSIONS.CUSTOMERS_CREATE),
  validateRequest(createCustomerSchema),
  asyncHandler(createCustomer)
);

customersRouter.get(
  "/:customerId/detail",
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  validateRequest(customerIdParamSchema, "params"),
  asyncHandler(getCustomerDetailHandler)
);

customersRouter.get(
  "/:customerId",
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  validateRequest(customerIdParamSchema, "params"),
  asyncHandler(getCustomer)
);

customersRouter.patch(
  "/:customerId",
  requirePermission(PERMISSIONS.CUSTOMERS_UPDATE),
  validateRequest(customerIdParamSchema, "params"),
  validateRequest(updateCustomerSchema),
  asyncHandler(updateCustomer)
);

customersRouter.delete(
  "/:customerId",
  requirePermission(PERMISSIONS.CUSTOMERS_DELETE),
  validateRequest(customerIdParamSchema, "params"),
  asyncHandler(deleteCustomer)
);
