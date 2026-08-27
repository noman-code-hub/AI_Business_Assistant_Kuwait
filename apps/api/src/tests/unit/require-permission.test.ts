import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import type { AppError } from "@aba/shared";
import { PERMISSIONS, Role } from "@aba/shared";
import { requirePermission } from "../../middleware/authorize.js";

function mockRes(locals: Partial<Response["locals"]>) {
  return { locals: { requestId: "t", startedAt: Date.now(), ...locals } } as unknown as Response;
}

describe("requirePermission middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("denies when unauthenticated", () => {
    const next = vi.fn() as unknown as NextFunction;
    requirePermission(PERMISSIONS.CUSTOMERS_CREATE)(
      {} as Request,
      mockRes({ tenantId: "t1", role: Role.OWNER }),
      next
    );
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("denies when tenant missing", () => {
    const next = vi.fn() as unknown as NextFunction;
    requirePermission(PERMISSIONS.CUSTOMERS_CREATE)(
      {} as Request,
      mockRes({ user: { uid: "u1" }, role: Role.OWNER }),
      next
    );
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("TENANT_REQUIRED");
  });

  it("VIEWER cannot POST customers — PERMISSION_DENIED", () => {
    const next = vi.fn() as unknown as NextFunction;
    requirePermission(PERMISSIONS.CUSTOMERS_CREATE)(
      {} as Request,
      mockRes({ user: { uid: "u1" }, tenantId: "t1", role: Role.VIEWER }),
      next
    );
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("PERMISSION_DENIED");
  });

  it("ADMIN can create customers", () => {
    const next = vi.fn() as unknown as NextFunction;
    requirePermission(PERMISSIONS.CUSTOMERS_CREATE)(
      {} as Request,
      mockRes({ user: { uid: "u1" }, tenantId: "t1", role: Role.ADMIN }),
      next
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("ignores forged role — only res.locals.role is used", () => {
    const next = vi.fn() as unknown as NextFunction;
    const req = { body: { role: Role.OWNER } } as unknown as Request;
    requirePermission(PERMISSIONS.TEAM_MANAGE)(
      req,
      mockRes({ user: { uid: "u1" }, tenantId: "t1", role: Role.STAFF }),
      next
    );
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("PERMISSION_DENIED");
  });

  it("ignores forged permissions in body", () => {
    const next = vi.fn() as unknown as NextFunction;
    const req = {
      body: { permissions: [PERMISSIONS.TEAM_MANAGE, PERMISSIONS.SETTINGS_MANAGE] },
    } as unknown as Request;
    requirePermission(PERMISSIONS.SETTINGS_MANAGE)(
      req,
      mockRes({ user: { uid: "u1" }, tenantId: "t1", role: Role.VIEWER }),
      next
    );
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("PERMISSION_DENIED");
  });
});
