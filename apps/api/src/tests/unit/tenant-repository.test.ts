import { describe, expect, it } from "vitest";
import { AppError } from "@aba/shared";
import { TenantScopedRepository } from "../../repositories/tenant-repository.js";

type Sample = { id: string; tenantId: string; name: string };

class TestRepo extends TenantScopedRepository<Sample> {
  protected readonly subcollection = "customers" as const;

  // Expose assert for unit tests without Firestore
  public checkTenant(tenantId: string) {
    this.assertTenantId(tenantId);
  }

  public checkDoc(tenantId: string, data: { tenantId?: string }) {
    this.assertDocTenant(tenantId, data);
  }
}

describe("TenantScopedRepository guards", () => {
  const repo = new TestRepo();

  it("rejects empty tenantId", () => {
    expect(() => repo.checkTenant("")).toThrow(AppError);
  });

  it("rejects cross-tenant document data", () => {
    expect(() => repo.checkDoc("tenant-a", { tenantId: "tenant-b" })).toThrow(AppError);
  });

  it("accepts matching tenant document data", () => {
    expect(() => repo.checkDoc("tenant-a", { tenantId: "tenant-a" })).not.toThrow();
  });
});
