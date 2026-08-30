import type { Request, Response } from "express";
import {
  AppError,
  normalizeRole,
  type ListCustomersQuery,
  type CreateCustomerInput,
  type UpdateCustomerInput,
  type CustomerImportBody,
} from "@aba/shared";
import { sendSuccess } from "../../../lib/api-response.js";
import {
  createCustomer as createCustomerService,
  deleteCustomer as deleteCustomerService,
  exportCustomers,
  getCustomer as getCustomerService,
  getCustomerDetail,
  listCustomers as listCustomersService,
  previewOrImportCustomers,
  updateCustomer as updateCustomerService,
  type CustomerAuthz,
} from "../services/customers.service.js";

function authz(res: Response): CustomerAuthz {
  const userId = res.locals.user?.uid;
  const tenantId = res.locals.tenantId;
  const role = normalizeRole(res.locals.role);
  if (!userId || !tenantId || !role) {
    throw AppError.unauthorized();
  }
  return { userId, tenantId, role };
}

function validatedQuery<T>(req: Request): T {
  const q = (req as Request & { validatedQuery?: T }).validatedQuery;
  if (!q) throw AppError.validation("Invalid query parameters");
  return q;
}

export async function listCustomers(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const query = validatedQuery<ListCustomersQuery>(req);
  const result = await listCustomersService(ctx, query);
  sendSuccess(res, result, { pagination: result.pagination });
}

export async function getCustomer(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const customerId = String(req.params.customerId ?? "");
  if (!customerId) throw AppError.validation("customerId is required");
  const customer = await getCustomerService(ctx, customerId);
  sendSuccess(res, { customer });
}

export async function getCustomerDetailHandler(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const customerId = String(req.params.customerId ?? "");
  if (!customerId) throw AppError.validation("customerId is required");
  const detail = await getCustomerDetail(ctx, customerId);
  sendSuccess(res, detail);
}

export async function createCustomer(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const customer = await createCustomerService(ctx, req.body as CreateCustomerInput);
  sendSuccess(res, { customer }, { status: 201 });
}

export async function updateCustomer(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const customerId = String(req.params.customerId ?? "");
  if (!customerId) throw AppError.validation("customerId is required");
  const customer = await updateCustomerService(ctx, customerId, req.body as UpdateCustomerInput);
  sendSuccess(res, { customer });
}

export async function deleteCustomer(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const customerId = String(req.params.customerId ?? "");
  if (!customerId) throw AppError.validation("customerId is required");
  await deleteCustomerService(ctx, customerId);
  sendSuccess(res, { deleted: true });
}

export async function importCustomers(req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const result = await previewOrImportCustomers(ctx, req.body as CustomerImportBody);
  sendSuccess(res, result, { status: req.body?.confirm ? 201 : 200 });
}

export async function exportCustomersHandler(_req: Request, res: Response): Promise<void> {
  const ctx = authz(res);
  const result = await exportCustomers(ctx);
  sendSuccess(res, result);
}
