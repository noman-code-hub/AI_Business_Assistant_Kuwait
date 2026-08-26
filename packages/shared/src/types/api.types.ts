import type { ErrorCode, ErrorDetail } from "../errors/app-error.js";

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type ApiSuccessMeta = {
  requestId: string;
  pagination?: PaginationMeta;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta: ApiSuccessMeta;
};

export type ApiErrorBody = {
  code: ErrorCode;
  message: string;
  details?: ErrorDetail[];
  requestId: string;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type Paginated<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type SortOrder = "asc" | "desc";

export type ListQuery = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
};
