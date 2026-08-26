import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";

vi.mock("../services/firebase/admin.js", () => ({
  isFirebaseAdminConfigured: vi.fn(() => false),
  getFirebaseAuth: vi.fn(() => null),
}));

vi.mock("../config/index.js", () => ({
  appConfig: { isLocal: true, isDev: true },
}));

import { authenticateMiddleware } from "./authenticate.js";

function mockRes() {
  const res = {
    locals: {} as Record<string, unknown>,
  };
  return res as unknown as Response;
}

describe("authenticateMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects missing Authorization header", async () => {
    const req = { header: () => undefined } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authenticateMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
    expect(err?.code).toBe("UNAUTHORIZED");
  });

  it("accepts local dev-token", async () => {
    const req = {
      header: (name: string) => (name === "Authorization" ? "Bearer dev-token" : undefined),
    } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authenticateMiddleware(req, res, next);

    expect(res.locals.user).toEqual({
      uid: "dev-user",
      email: "dev@example.com",
      emailVerified: true,
    });
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects when Admin is not configured", async () => {
    const req = {
      header: (name: string) => (name === "Authorization" ? "Bearer real-token" : undefined),
    } as unknown as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    await authenticateMiddleware(req, res, next);

    const err = (next as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
    expect(err?.code).toBe("UNAUTHORIZED");
    expect(String(err?.message)).toMatch(/not configured/i);
  });
});
