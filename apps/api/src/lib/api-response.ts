import type { Response } from "express";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ErrorCode,
  ErrorDetail,
  PaginationMeta,
} from "@aba/shared";

export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: {
    status?: number;
    requestId?: string;
    pagination?: PaginationMeta;
  }
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      requestId: options?.requestId ?? (res.locals.requestId as string) ?? "unknown",
      ...(options?.pagination ? { pagination: options.pagination } : {}),
    },
  };
  return res.status(options?.status ?? 200).json(body);
}

export function sendError(
  res: Response,
  options: {
    status: number;
    code: ErrorCode;
    message: string;
    details?: ErrorDetail[];
    requestId?: string;
  }
): Response {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: options.code,
      message: options.message,
      ...(options.details ? { details: options.details } : {}),
      requestId: options.requestId ?? (res.locals.requestId as string) ?? "unknown",
    },
  };
  return res.status(options.status).json(body);
}

export function buildPaginationMeta(input: {
  page: number;
  pageSize: number;
  total: number;
}): PaginationMeta {
  const { page, pageSize, total } = input;
  return {
    page,
    pageSize,
    total,
    hasMore: page * pageSize < total,
  };
}
