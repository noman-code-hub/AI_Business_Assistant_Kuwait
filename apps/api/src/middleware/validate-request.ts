import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { formatZodError, AppError } from "@aba/shared";

type RequestPart = "body" | "query" | "params";

export function validateRequest<T>(schema: ZodType<T>, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      next(AppError.validation("Validation failed", formatZodError(result.error)));
      return;
    }

    if (part === "body") {
      req.body = result.data;
    } else if (part === "query") {
      // Express 5 query is read-only in types; attach parsed data for handlers.
      (req as Request & { validatedQuery?: T }).validatedQuery = result.data;
    } else {
      (req as Request & { validatedParams?: T }).validatedParams = result.data;
    }

    next();
  };
}
