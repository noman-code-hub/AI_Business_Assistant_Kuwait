import type { Request, Response } from "express";
import { AppError, EntityStatus } from "@aba/shared";
import { sendSuccess } from "../../../lib/api-response.js";
import { customerRepository } from "../../../repositories/customer.repository.js";
import { serviceRepository } from "../../../repositories/catalog.repository.js";

/** Tenant-scoped customer read — used for isolation tests and Phase 3 readiness. */
export async function getCustomer(req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  const customerId = String(req.params.customerId ?? "");
  if (!tenantId) throw AppError.tenantRequired();
  if (!customerId) throw AppError.validation("customerId is required");

  const customer = await customerRepository.getById(tenantId, customerId);
  if (!customer) throw AppError.notFound("customer");
  sendSuccess(res, { customer });
}

export async function listCustomers(_req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();
  const customers = await customerRepository.list(tenantId, { limit: 50 });
  sendSuccess(res, { customers });
}

export async function createCustomer(req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) throw AppError.validation("name is required");

  const customer = await customerRepository.create(tenantId, {
    tenantId,
    name,
    email: req.body?.email,
    phone: req.body?.phone,
    status: EntityStatus.ACTIVE,
    source: "manual",
  });
  sendSuccess(res, { customer }, { status: 201 });
}

export async function createService(req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();

  // Reject client-supplied tenantId mismatch
  if (req.body?.tenantId && req.body.tenantId !== tenantId) {
    throw AppError.tenantAccessDenied();
  }

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const price = Number(req.body?.price);
  const durationMinutes = Number(req.body?.durationMinutes);
  if (!name) throw AppError.validation("name is required");
  if (!Number.isFinite(price) || price < 0) throw AppError.validation("price is invalid");
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw AppError.validation("durationMinutes is invalid");
  }

  const service = await serviceRepository.create(tenantId, {
    tenantId,
    name,
    description: req.body?.description,
    price: { amount: price, currency: "KWD" },
    durationMinutes,
    status: EntityStatus.ACTIVE,
  });
  sendSuccess(res, { service }, { status: 201 });
}

export async function listServices(_req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();
  const services = await serviceRepository.list(tenantId, { limit: 50 });
  sendSuccess(res, { services });
}
