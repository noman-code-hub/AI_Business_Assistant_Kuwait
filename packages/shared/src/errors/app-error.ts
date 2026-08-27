export const ErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  TENANT_REQUIRED: "TENANT_REQUIRED",
  TENANT_ACCESS_DENIED: "TENANT_ACCESS_DENIED",
  TENANT_SUSPENDED: "TENANT_SUSPENDED",
  LAST_OWNER_REQUIRED: "LAST_OWNER_REQUIRED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  INTEGRATION_ERROR: "INTEGRATION_ERROR",
  AI_GUARDRAIL_BLOCKED: "AI_GUARDRAIL_BLOCKED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  PERMISSION_DENIED: 403,
  TENANT_REQUIRED: 400,
  TENANT_ACCESS_DENIED: 403,
  TENANT_SUSPENDED: 403,
  LAST_OWNER_REQUIRED: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  QUOTA_EXCEEDED: 429,
  INTEGRATION_ERROR: 502,
  AI_GUARDRAIL_BLOCKED: 400,
  INTERNAL_ERROR: 500,
};

export type ErrorDetail = {
  path?: string;
  message: string;
  code?: string;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly details?: ErrorDetail[];
  readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    details?: ErrorDetail[],
    httpStatus?: number
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.httpStatus = httpStatus ?? ERROR_HTTP_STATUS[code];
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static unauthorized(message = "Authentication required"): AppError {
    return new AppError(ErrorCode.UNAUTHORIZED, message);
  }

  static forbidden(message = "Access denied"): AppError {
    return new AppError(ErrorCode.FORBIDDEN, message);
  }

  static permissionDenied(
    message = "You do not have permission to perform this action."
  ): AppError {
    return new AppError(ErrorCode.PERMISSION_DENIED, message);
  }

  static lastOwnerRequired(
    message = "A business must retain at least one active owner."
  ): AppError {
    return new AppError(ErrorCode.LAST_OWNER_REQUIRED, message);
  }

  static notFound(resource = "Resource"): AppError {
    return new AppError(ErrorCode.NOT_FOUND, `${resource} not found`);
  }

  static validation(message: string, details?: ErrorDetail[]): AppError {
    return new AppError(ErrorCode.VALIDATION_ERROR, message, details);
  }

  static conflict(message: string): AppError {
    return new AppError(ErrorCode.CONFLICT, message);
  }

  static internal(message = "An unexpected error occurred"): AppError {
    return new AppError(ErrorCode.INTERNAL_ERROR, message);
  }

  static tenantRequired(): AppError {
    return new AppError(ErrorCode.TENANT_REQUIRED, "X-Tenant-Id header is required");
  }

  static tenantAccessDenied(message = "You do not have access to this business."): AppError {
    return new AppError(ErrorCode.TENANT_ACCESS_DENIED, message);
  }

  static tenantSuspended(): AppError {
    return new AppError(ErrorCode.TENANT_SUSPENDED, "Tenant is suspended");
  }
}
