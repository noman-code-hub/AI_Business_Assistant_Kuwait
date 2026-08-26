import type { Request, Response } from "express";
import { sendSuccess } from "../../../lib/api-response.js";
import { getEnv } from "../../../config/env.js";

export function getHealth(_req: Request, res: Response): void {
  const env = getEnv();
  sendSuccess(res, {
    status: "ok",
    service: "@aba/api",
    appEnv: env.APP_ENV,
    timestamp: new Date().toISOString(),
  });
}
