import type { NextFunction, Request, Response } from "express";
import { AppError, ErrorCode } from "@aba/shared";
import { sendError } from "../lib/api-response.js";
import { createLogger } from "../lib/logger.js";
import { getEnv } from "../config/env.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route ${req.method} ${req.path}`));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const logger = createLogger(getEnv());
  const requestId = res.locals.requestId ?? "unknown";
  const latencyMs = res.locals.startedAt ? Date.now() - res.locals.startedAt : undefined;

  if (err instanceof AppError) {
    logger.warn(err.message, {
      requestId,
      tenantId: res.locals.tenantId,
      userId: res.locals.user?.uid,
      code: err.code,
      path: req.path,
      method: req.method,
      latencyMs,
      details: err.details,
    });

    sendError(res, {
      status: err.httpStatus,
      code: err.code,
      message: err.message,
      details: err.details,
      requestId,
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  logger.error(message, {
    requestId,
    tenantId: res.locals.tenantId,
    userId: res.locals.user?.uid,
    code: ErrorCode.INTERNAL_ERROR,
    path: req.path,
    method: req.method,
    latencyMs,
    stack: err instanceof Error ? err.stack : undefined,
  });

  sendError(res, {
    status: 500,
    code: ErrorCode.INTERNAL_ERROR,
    message: "An unexpected error occurred",
    requestId,
  });
}
