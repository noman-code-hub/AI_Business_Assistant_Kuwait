import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError, Role, MembershipStatus } from "@aba/shared";

const { get, update, softDelete, countActiveOwners, append } = vi.hoisted(() => ({
  get: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
  countActiveOwners: vi.fn(),
  append: vi.fn(),
}));

vi.mock("../../repositories/business-member.repository.js", () => ({
  businessMemberRepository: { get, update, softDelete, countActiveOwners, listByTenant: vi.fn() },
}));

vi.mock("../../repositories/ops.repository.js", () => ({
  auditLogRepository: { append },
}));

import {
  updateMemberRole,
  updateMemberStatus,
} from "../../modules/memberships/services/memberships.service.js";

const ctx = { userId: "owner-1", tenantId: "biz-a", role: Role.OWNER };

describe("membership role & status changes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    append.mockResolvedValue({});
  });

  it("allows STAFF → MANAGER when authorized", async () => {
    get.mockResolvedValue({
      id: "u2_biz-a",
      userId: "u2",
      tenantId: "biz-a",
      role: Role.STAFF,
      status: MembershipStatus.ACTIVE,
    });
    update.mockResolvedValue({
      id: "u2_biz-a",
      userId: "u2",
      tenantId: "biz-a",
      role: Role.MANAGER,
      status: MembershipStatus.ACTIVE,
    });

    const result = await updateMemberRole(ctx, "u2", Role.MANAGER);
    expect(result.role).toBe(Role.MANAGER);
    expect(update).toHaveBeenCalledWith("u2", "biz-a", { role: Role.MANAGER });
  });

  it("denies STAFF → OWNER", async () => {
    await expect(updateMemberRole(ctx, "u2", Role.OWNER)).rejects.toMatchObject({
      code: "PERMISSION_DENIED",
    });
  });

  it("denies self role change to OWNER / any role", async () => {
    await expect(updateMemberRole(ctx, "owner-1", Role.ADMIN)).rejects.toMatchObject({
      code: "PERMISSION_DENIED",
    });
  });

  it("denies cross-tenant membership update", async () => {
    get.mockResolvedValue({
      id: "u2_biz-b",
      userId: "u2",
      tenantId: "biz-b",
      role: Role.STAFF,
      status: MembershipStatus.ACTIVE,
    });
    await expect(updateMemberRole(ctx, "u2", Role.MANAGER)).rejects.toMatchObject({
      code: "TENANT_ACCESS_DENIED",
    });
  });

  it("protects last OWNER demotion", async () => {
    get.mockResolvedValue({
      id: "owner-1_biz-a",
      userId: "other-owner",
      tenantId: "biz-a",
      role: Role.OWNER,
      status: MembershipStatus.ACTIVE,
    });
    countActiveOwners.mockResolvedValue(1);
    await expect(updateMemberRole(ctx, "other-owner", Role.ADMIN)).rejects.toMatchObject({
      code: "LAST_OWNER_REQUIRED",
    });
  });

  it("protects last OWNER suspension", async () => {
    get.mockResolvedValue({
      id: "owner-1_biz-a",
      userId: "owner-1",
      tenantId: "biz-a",
      role: Role.OWNER,
      status: MembershipStatus.ACTIVE,
    });
    countActiveOwners.mockResolvedValue(1);
    await expect(
      updateMemberStatus(ctx, "owner-1", MembershipStatus.SUSPENDED)
    ).rejects.toMatchObject({ code: "LAST_OWNER_REQUIRED" });
  });

  it("allows suspending a non-owner", async () => {
    get.mockResolvedValue({
      id: "u2_biz-a",
      userId: "u2",
      tenantId: "biz-a",
      role: Role.STAFF,
      status: MembershipStatus.ACTIVE,
    });
    update.mockResolvedValue({
      id: "u2_biz-a",
      userId: "u2",
      tenantId: "biz-a",
      role: Role.STAFF,
      status: MembershipStatus.SUSPENDED,
    });
    const result = await updateMemberStatus(ctx, "u2", MembershipStatus.SUSPENDED);
    expect(result.status).toBe(MembershipStatus.SUSPENDED);
  });
});

describe("membership status access semantics", () => {
  it("AppError helpers exist for permission and last owner", () => {
    expect(AppError.permissionDenied().code).toBe("PERMISSION_DENIED");
    expect(AppError.lastOwnerRequired().code).toBe("LAST_OWNER_REQUIRED");
  });
});
