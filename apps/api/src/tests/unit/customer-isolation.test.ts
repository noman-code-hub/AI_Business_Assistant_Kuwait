import { describe, expect, it, vi, beforeEach } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { AppError, Role } from "@aba/shared";

const getById = vi.hoisted(() => vi.fn());

vi.mock("../../repositories/customer.repository.js", () => ({
  customerRepository: { getById },
}));

import { getCustomer } from "../../modules/customers/controllers/customers.controller.js";

function mockRes(tenantId?: string, userId = "user-1", role = Role.OWNER) {
  return {
    locals: {
      tenantId,
      requestId: "test",
      user: userId ? { uid: userId } : undefined,
      role,
    },
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe("customer tenant isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TEST isolation: Business B context cannot read missing/foreign customer as if it were A", async () => {
    getById.mockRejectedValue(AppError.forbidden("Cross-tenant access denied"));

    const req = { params: { customerId: "cust-a" } } as unknown as Request;
    const res = mockRes("tenant-b");
    const next = vi.fn() as unknown as NextFunction;

    await expect(getCustomer(req, res)).rejects.toMatchObject({
      message: expect.stringMatching(/cross-tenant|access denied/i),
    });
    void next;
  });

  it("allows read when customer belongs to active tenant", async () => {
    getById.mockResolvedValue({
      id: "cust-a",
      tenantId: "tenant-a",
      name: "Customer A",
    });
    const req = { params: { customerId: "cust-a" } } as unknown as Request;
    const res = mockRes("tenant-a");
    await getCustomer(req, res);
    expect(getById).toHaveBeenCalledWith("tenant-a", "cust-a");
    expect(res.json).toHaveBeenCalled();
  });

  it("requires tenant context", async () => {
    const req = { params: { customerId: "cust-a" } } as unknown as Request;
    const res = mockRes(undefined);
    await expect(getCustomer(req, res)).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
