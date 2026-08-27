import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "demo-aba-phase1";
const RULES_PATH = resolve(process.cwd(), "../../firebase/firestore.rules");

let testEnv: RulesTestEnvironment;

const tenantA = "tenant-a";
const tenantB = "tenant-b";
const userA = "user-a";
const userB = "user-b";

async function seedMemberships(env: RulesTestEnvironment): Promise<void> {
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc(`tenantMemberships/${userA}_${tenantA}`).set({
      userId: userA,
      tenantId: tenantA,
      role: "owner",
      status: "active",
    });
    await db.doc(`tenantMemberships/${userB}_${tenantB}`).set({
      userId: userB,
      tenantId: tenantB,
      role: "owner",
      status: "active",
    });
    await db.doc(`tenants/${tenantA}`).set({
      name: "Business A",
      ownerUid: userA,
      status: "active",
    });
    await db.doc(`tenants/${tenantB}`).set({
      name: "Business B",
      ownerUid: userB,
      status: "active",
    });
    await db.doc(`tenants/${tenantA}/customers/cust-a`).set({
      tenantId: tenantA,
      name: "Customer A",
      status: "active",
    });
    await db.doc(`tenants/${tenantB}/customers/cust-b`).set({
      tenantId: tenantB,
      name: "Customer B",
      status: "active",
    });
  });
}

describe("Firestore security rules — tenant isolation", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: readFileSync(RULES_PATH, "utf8"),
        host: "127.0.0.1",
        port: 8081,
      },
    });
  }, 60_000);

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await seedMemberships(testEnv);
  });

  it("TEST 1: unauthenticated read of business data is DENIED", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.doc(`tenants/${tenantA}/customers/cust-a`).get());
  });

  it("TEST 2: user from Business A reads Business A customer — ALLOWED", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertSucceeds(db.doc(`tenants/${tenantA}/customers/cust-a`).get());
  });

  it("TEST 3: user from Business A reads Business B customer — DENIED", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertFails(db.doc(`tenants/${tenantB}/customers/cust-b`).get());
  });

  it("TEST 4: user from Business A creates customer for Business A — ALLOWED", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertSucceeds(
      db.doc(`tenants/${tenantA}/customers/cust-new`).set({
        tenantId: tenantA,
        name: "New Customer",
        status: "active",
      })
    );
  });

  it("TEST 5: user from Business A creates customer with Business B tenantId — DENIED", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertFails(
      db.doc(`tenants/${tenantA}/customers/cust-evil`).set({
        tenantId: tenantB,
        name: "Evil",
        status: "active",
      })
    );
  });

  it("TEST 6: user from Business A updates Business B document — DENIED", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertFails(
      db.doc(`tenants/${tenantB}/customers/cust-b`).update({
        name: "Hacked",
        tenantId: tenantB,
      })
    );
  });

  it("TEST 7: user from Business A deletes Business B document — DENIED", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertFails(db.doc(`tenants/${tenantB}/customers/cust-b`).delete());
  });

  it("TEST 8: unauthenticated write of business data is DENIED", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db.doc(`tenants/${tenantA}/customers/cust-anon`).set({
        tenantId: tenantA,
        name: "Anon",
        status: "active",
      })
    );
  });

  it("TEST 9: client cannot forge membership role to owner", async () => {
    const db = testEnv.authenticatedContext(userA).firestore();
    await assertFails(
      db.doc(`tenantMemberships/${userA}_${tenantA}`).update({
        role: "owner",
        status: "active",
      })
    );
  });
});
