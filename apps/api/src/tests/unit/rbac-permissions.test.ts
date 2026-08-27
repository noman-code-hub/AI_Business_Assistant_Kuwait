import { describe, expect, it } from "vitest";
import {
  Role,
  PERMISSIONS,
  hasPermission,
  permissionsForRole,
  normalizeRole,
} from "@aba/shared";

describe("RBAC permission matrix", () => {
  it("TEST 1: OWNER customers.read — ALLOW", () => {
    expect(hasPermission(Role.OWNER, PERMISSIONS.CUSTOMERS_READ)).toBe(true);
  });

  it("TEST 2: OWNER team.manage — ALLOW", () => {
    expect(hasPermission(Role.OWNER, PERMISSIONS.TEAM_MANAGE)).toBe(true);
  });

  it("TEST 3: ADMIN customers.create — ALLOW", () => {
    expect(hasPermission(Role.ADMIN, PERMISSIONS.CUSTOMERS_CREATE)).toBe(true);
  });

  it("TEST 4: MANAGER appointments.update — ALLOW", () => {
    expect(hasPermission(Role.MANAGER, PERMISSIONS.APPOINTMENTS_UPDATE)).toBe(true);
  });

  it("TEST 5: RECEPTIONIST appointments.create — ALLOW", () => {
    expect(hasPermission(Role.RECEPTIONIST, PERMISSIONS.APPOINTMENTS_CREATE)).toBe(true);
  });

  it("TEST 6: ACCOUNTANT invoices.create — ALLOW", () => {
    expect(hasPermission(Role.ACCOUNTANT, PERMISSIONS.INVOICES_CREATE)).toBe(true);
  });

  it("TEST 7: ACCOUNTANT appointments.cancel — DENY", () => {
    expect(hasPermission(Role.ACCOUNTANT, PERMISSIONS.APPOINTMENTS_CANCEL)).toBe(false);
  });

  it("TEST 8: VIEWER customers.read — ALLOW", () => {
    expect(hasPermission(Role.VIEWER, PERMISSIONS.CUSTOMERS_READ)).toBe(true);
  });

  it("TEST 9: VIEWER customers.delete — DENY", () => {
    expect(hasPermission(Role.VIEWER, PERMISSIONS.CUSTOMERS_DELETE)).toBe(false);
  });

  it("TEST 10: STAFF settings.manage — DENY", () => {
    expect(hasPermission(Role.STAFF, PERMISSIONS.SETTINGS_MANAGE)).toBe(false);
  });

  it("OWNER gets every registered permission via centralized checker", () => {
    for (const p of Object.values(PERMISSIONS)) {
      expect(hasPermission(Role.OWNER, p)).toBe(true);
    }
  });

  it("ADMIN cannot manage subscription (ownership-level)", () => {
    expect(hasPermission(Role.ADMIN, PERMISSIONS.SUBSCRIPTION_MANAGE)).toBe(false);
    expect(hasPermission(Role.OWNER, PERMISSIONS.SUBSCRIPTION_MANAGE)).toBe(true);
  });

  it("normalizeRole maps legacy readonly → viewer", () => {
    expect(normalizeRole("readonly")).toBe(Role.VIEWER);
  });

  it("permissionsForRole resets cleanly per role (no bleed)", () => {
    const owner = new Set(permissionsForRole(Role.OWNER));
    const viewer = new Set(permissionsForRole(Role.VIEWER));
    expect(owner.has(PERMISSIONS.TEAM_MANAGE)).toBe(true);
    expect(viewer.has(PERMISSIONS.TEAM_MANAGE)).toBe(false);
  });
});
