/**
 * Development seed — NEVER runs against production.
 *
 * Required:
 *   APP_ENV=local
 *   SEED_FIRESTORE=1
 * Prefer: FIRESTORE_EMULATOR_HOST=127.0.0.1:8081
 *
 * Usage:
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8081 APP_ENV=local SEED_FIRESTORE=1 \
 *     npx tsx apps/api/src/scripts/seed-dev.ts
 */

import { config as loadDotenv } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
loadDotenv({ path: resolve(__dirname, "../../.env") });

function assertSafeToSeed(): void {
  const appEnv = process.env.APP_ENV ?? "local";
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const confirm = process.env.SEED_FIRESTORE;
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;

  if (appEnv === "production" || nodeEnv === "production") {
    throw new Error("Refusing to seed: production environment");
  }
  if (confirm !== "1") {
    throw new Error("Refusing to seed: set SEED_FIRESTORE=1 explicitly");
  }
  if (!emulator && process.env.ALLOW_SEED_WITHOUT_EMULATOR !== "1") {
    throw new Error(
      "Refusing to seed without FIRESTORE_EMULATOR_HOST. Set ALLOW_SEED_WITHOUT_EMULATOR=1 only for a dedicated non-prod project."
    );
  }
}

async function main(): Promise<void> {
  assertSafeToSeed();

  const { loadEnv } = await import("../config/env.js");
  loadEnv();

  const { userRepository } = await import("../repositories/user.repository.js");
  const { businessRepository } = await import("../repositories/business.repository.js");
  const { businessMemberRepository } = await import("../repositories/business-member.repository.js");
  const { customerRepository } = await import("../repositories/customer.repository.js");
  const { serviceRepository, productRepository } = await import("../repositories/catalog.repository.js");

  const userId = "seed-dev-user";
  const tenantId = "seed-dev-tenant";

  await userRepository.upsert(userId, {
    email: "dev@aba.local",
    displayName: "Dev Owner",
    status: "active",
    locale: "en",
    timezone: "Asia/Kuwait",
  });

  await businessRepository.create({
    id: tenantId,
    name: "Kuwait Demo Salon",
    slug: "kuwait-demo-salon",
    description: "Phase 1 development seed business",
    country: "KW",
    vertical: "salon",
    status: "active",
    locale: "en",
    timezone: "Asia/Kuwait",
    currency: "KWD",
    ownerUid: userId,
  });

  await businessMemberRepository.create({
    userId,
    tenantId,
    role: "owner",
    status: "active",
  });

  await customerRepository.create(tenantId, {
    tenantId,
    name: "Fatima Al-Sabah",
    phone: "+96550000001",
    email: "fatima@example.com",
    status: "active",
    source: "manual",
  });

  await serviceRepository.create(tenantId, {
    tenantId,
    name: "Haircut",
    description: "Standard haircut",
    price: { amount: 8, currency: "KWD" },
    durationMinutes: 45,
    status: "active",
  });

  await productRepository.create(tenantId, {
    tenantId,
    name: "Hair Oil",
    price: { amount: 4.5, currency: "KWD" },
    stockQty: 20,
    status: "active",
  });

  console.warn("Seed complete:", { userId, tenantId, emulator: process.env.FIRESTORE_EMULATOR_HOST });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
