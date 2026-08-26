import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import type { AppError } from "@aba/shared";

const { getActiveMembership, getById } = vi.hoisted(() => ({
  getActiveMembership: vi.fn(),
  getById: vi.fn(),
}));

vi.mock("../../repositories/business-member.repository.js", () => ({
  businessMemberRepository: { getActiveMembership },
}));

vi.mock("../../repositories/business.repository.js", () => ({
  businessRepository: { getById },
}));

vi.mock("../../services/firebase/admin.js", () => ({
  isFirebaseAdminConfigured: vi.fn(() => true),
}));

vi.mock("../../config/index.js", () => ({
  appConfig: { isLocal: false, isDev: true },
}));

import { resolveTenantMiddleware } from "../../middleware/resolve-tenant.js";

function mockRes(user?: { uid: string }) {
  return { locals: { user } } as unknown as Response;
}

describe("resolveTenantMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires X-Tenant-Id", async () => {
    const req = { header: () => undefined } as unknown as Request;
    const res = mockRes({ uid: "u1" });
    const next = vi.fn() as unknown as NextFunction;
    await resolveTenantMiddleware(req, res, next);
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("TENANT_REQUIRED");
  });

  it("denies when membership missing", async () => {
    getActiveMembership.mockResolvedValue(null);
    const req = {
      header: (n: string) => (n === "X-Tenant-Id" ? "t1" : undefined),
    } as unknown as Request;
    const res = mockRes({ uid: "u1" });
    const next = vi.fn() as unknown as NextFunction;
    await resolveTenantMiddleware(req, res, next);
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0] as AppError;
    expect(err.code).toBe("TENANT_ACCESS_DENIED");
  });

  it("sets trusted tenantId and role on success", async () => {
    getActiveMembership.mockResolvedValue({ role: "admin", status: "active" });
    getById.mockResolvedValue({ id: "t1", status: "active" });
    const req = {
      header: (n: string) => (n === "X-Tenant-Id" ? "t1" : undefined),
    } as unknown as Request;
    const res = mockRes({ uid: "u1" });
    const next = vi.fn() as unknown as NextFunction;
    await resolveTenantMiddleware(req, res, next);
    expect(res.locals.tenantId).toBe("t1");
    expect(res.locals.role).toBe("admin");
    expect(next).toHaveBeenCalledWith();
  });
});
