import type { Request, Response } from "express";
import { sendSuccess } from "../../../lib/api-response.js";

export function getMe(req: Request, res: Response): void {
  sendSuccess(res, {
    user: res.locals.user ?? null,
    requestId: res.locals.requestId,
  });
}
