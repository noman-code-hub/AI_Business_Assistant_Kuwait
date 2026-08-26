import type { NextFunction, Request, Response } from "express";
import { AppError, ErrorCode } from "@aba/shared";
import { getEnv } from "../config/env.js";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const env = getEnv();
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  existing.count += 1;
  if (existing.count > env.RATE_LIMIT_MAX) {
    next(new AppError(ErrorCode.RATE_LIMITED, "Too many requests"));
    return;
  }

  next();
}
