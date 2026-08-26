import type { z } from "zod";
import { AppError } from "../errors/app-error.js";
import type { ErrorDetail } from "../errors/app-error.js";

export function formatZodError(error: z.ZodError): ErrorDetail[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, message = "Validation failed"): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw AppError.validation(message, formatZodError(result.error));
  }
  return result.data;
}
