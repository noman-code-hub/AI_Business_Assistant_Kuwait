import { AppError, ErrorCode } from "@aba/shared";

export { AppError, ErrorCode };

/** API-local re-export for convenience; prefer @aba/shared in new code. */
export class HttpError extends AppError {
  constructor(
    code: ErrorCode,
    message: string,
    details?: ConstructorParameters<typeof AppError>[2],
    httpStatus?: number
  ) {
    super(code, message, details, httpStatus);
    this.name = "HttpError";
  }
}
