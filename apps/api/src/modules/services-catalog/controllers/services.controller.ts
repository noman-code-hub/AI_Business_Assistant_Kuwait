import type { Request, Response } from "express";
import { AppError, EntityStatus } from "@aba/shared";
import { sendSuccess } from "../../../lib/api-response.js";
import { serviceRepository } from "../../../repositories/catalog.repository.js";

export async function listServices(_req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();
  const services = await serviceRepository.list(tenantId, { limit: 50 });
  sendSuccess(res, { services });
}

export async function createService(req: Request, res: Response): Promise<void> {
  const tenantId = res.locals.tenantId;
  if (!tenantId) throw AppError.tenantRequired();

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
