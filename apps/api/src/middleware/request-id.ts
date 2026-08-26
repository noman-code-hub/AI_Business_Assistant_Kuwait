import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const headerId = req.header("X-Request-Id");
  const requestId = headerId && headerId.trim().length > 0 ? headerId.trim() : randomUUID();
  res.locals.requestId = requestId;
  res.locals.startedAt = Date.now();
  res.setHeader("X-Request-Id", requestId);
  next();
}
