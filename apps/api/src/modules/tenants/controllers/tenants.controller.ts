import type { Request, Response } from "express";
import { AppError } from "@aba/shared";
import { sendSuccess } from "../../../lib/api-response.js";
import {
  createBusinessForOwner,
  getBusinessForMember,
  listBusinessesForUser,
} from "../services/tenants.service.js";

export async function createBusiness(req: Request, res: Response): Promise<void> {
  const user = res.locals.user;
  if (!user?.uid) throw AppError.unauthorized();

  const idempotencyKey = req.header("Idempotency-Key")?.trim() || undefined;
  const result = await createBusinessForOwner(user.uid, req.body, { idempotencyKey });

  sendSuccess(
    res,
    {
      tenantId: result.tenantId,
      businessId: result.tenantId,
      business: result.business,
      membership: result.membership,
      serviceIds: result.serviceIds,
    },
    { status: 201 }
  );
}

export async function listMyBusinesses(_req: Request, res: Response): Promise<void> {
  const user = res.locals.user;
  if (!user?.uid) throw AppError.unauthorized();

  const businesses = await listBusinessesForUser(user.uid);
  sendSuccess(res, { businesses });
}

export async function getBusiness(req: Request, res: Response): Promise<void> {
  const user = res.locals.user;
  if (!user?.uid) throw AppError.unauthorized();

  const businessId = String(req.params.businessId ?? "");
  if (!businessId) throw AppError.validation("businessId is required");

  const { business, membership } = await getBusinessForMember(user.uid, businessId);
  sendSuccess(res, { business, membership, tenantId: business.id });
}
