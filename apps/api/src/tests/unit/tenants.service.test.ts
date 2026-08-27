import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError, Role, Vertical, defaultWorkingHours } from "@aba/shared";

const {
  setMock,
  batchCommit,
  docMock,
  collectionMock,
  batchMock,
  getById,
  getMembership,
  listByUser,
  getActiveMembership,
  appendAudit,
} = vi.hoisted(() => {
  const setMock = vi.fn();
  const batchCommit = vi.fn(async () => undefined);
  const docMock = vi.fn(() => ({ id: "tenant-new", path: "tenants/tenant-new" }));
  const collectionMock = vi.fn(() => ({ doc: docMock }));
  const batchMock = vi.fn(() => ({ set: setMock, commit: batchCommit }));
  return {
    setMock,
    batchCommit,
    docMock,
    collectionMock,
    batchMock,
    getById: vi.fn(),
    getMembership: vi.fn(),
    listByUser: vi.fn(),
    getActiveMembership: vi.fn(),
    appendAudit: vi.fn(),
  };
});

vi.mock("../../db/index.js", () => ({
  getDb: () => ({
    collection: collectionMock,
    batch: batchMock,
  }),
  FieldValue: { serverTimestamp: () => "SERVER_TS" },
  TopLevel: { tenants: "tenants", tenantMemberships: "tenantMemberships" },
  membershipId: (userId: string, tenantId: string) => `${userId}_${tenantId}`,
  tenantCollection: (tenantId: string, name: string) => `tenants/${tenantId}/${name}`,
}));

vi.mock("../../repositories/business.repository.js", () => ({
  businessRepository: { getById },
}));

vi.mock("../../repositories/business-member.repository.js", () => ({
  businessMemberRepository: {
    get: getMembership,
    listByUser,
    getActiveMembership,
  },
}));

vi.mock("../../repositories/ops.repository.js", () => ({
  auditLogRepository: { append: appendAudit },
}));

import {
  createBusinessForOwner,
  getBusinessForMember,
  listBusinessesForUser,
} from "../../modules/tenants/services/tenants.service.js";

describe("createBusinessForOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    let n = 0;
    docMock.mockImplementation(() => {
      n += 1;
      if (n === 1) return { id: "tenant-new", path: "tenants/tenant-new" };
      return { id: `svc-${n}`, path: `tenants/tenant-new/services/svc-${n}` };
    });
    getById.mockResolvedValue({
      id: "tenant-new",
      name: "Demo Salon",
      vertical: Vertical.SALON,
      ownerUid: "user-1",
    });
    getMembership.mockResolvedValue({
      id: "user-1_tenant-new",
      userId: "user-1",
      tenantId: "tenant-new",
      role: Role.OWNER,
      status: "active",
    });
    appendAudit.mockResolvedValue({});
  });

  it("creates business with server-generated tenantId and OWNER membership", async () => {
    const result = await createBusinessForOwner("user-1", {
      name: "Demo Salon",
      vertical: Vertical.SALON,
      country: "Kuwait",
      currency: "KWD",
      timezone: "Asia/Kuwait",
      workingHours: defaultWorkingHours(),
      services: [{ name: "Haircut", price: 5, durationMinutes: 30 }],
    });

    expect(result.tenantId).toBe("tenant-new");
    expect(result.membership.role).toBe(Role.OWNER);
    expect(batchCommit).toHaveBeenCalled();
    expect(setMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("rejects invalid payload", async () => {
    await expect(createBusinessForOwner("user-1", { name: "x" })).rejects.toBeInstanceOf(AppError);
  });
});

describe("tenant isolation helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("denies getBusinessForMember without membership", async () => {
    getActiveMembership.mockResolvedValue(null);
    await expect(getBusinessForMember("user-b", "tenant-a")).rejects.toMatchObject({
      code: "TENANT_ACCESS_DENIED",
    });
  });

  it("lists only memberships for the user", async () => {
    listByUser.mockResolvedValue([
      { tenantId: "t1", role: "owner", status: "active" },
      { tenantId: "t2", role: "admin", status: "active" },
    ]);
    getById
      .mockResolvedValueOnce({ id: "t1", name: "A", vertical: "salon", logoUrl: null })
      .mockResolvedValueOnce({ id: "t2", name: "B", vertical: "clinic", logoUrl: null });

    const list = await listBusinessesForUser("user-1");
    expect(list).toHaveLength(2);
    expect(list.map((b) => b.id).sort()).toEqual(["t1", "t2"]);
  });
});
