# Phase 1 — Firebase & Database

This document describes what Phase 1 implemented in code. It does **not** claim Firebase Console resources were created for you.

## Canonical naming

| Phase 1 brief | Implementation |
|---------------|----------------|
| Business | `tenants` collection (`Business` type alias) |
| BusinessMember | `tenantMemberships` (`BusinessMember` alias) |
| tenantId | Canonical tenant key on every business-owned document |

Do **not** introduce a parallel `businesses` / `businessMembers` collection.

## Firebase services (code-ready)

| Service | Code / config |
|---------|----------------|
| Auth | Client: `apps/web/src/lib/firebase.ts`; Admin verify: `apps/api` |
| Firestore | Admin: `apps/api/src/db`; Client bootstrap already exists |
| Storage | Admin `getBucket()`; `firebase/storage.rules` |
| Functions | `firebase/functions` (health stub only) |
| Hosting | `firebase/firebase.json` → `apps/web/dist` |
| Emulators | Auth, Firestore, Functions, Hosting, Storage in `firebase.json` |

## Environment variables (API)

Required for Admin SDK:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (escape newlines as `\n` in `.env`)
- `FIREBASE_STORAGE_BUCKET` (recommended)

Never commit `apps/api/.env`. Use `apps/api/.env.example`.

## Soft-delete strategy

**Soft delete** via `deletedAt` (nullable). Repositories hide deleted docs by default. Hard delete is reserved for admin/cleanup jobs.

## Repository layer

Trusted path:

```
Request → Auth token → user → membership → trusted tenantId → repository → Firestore
```

Repositories live in `apps/api/src/repositories/`. Tenant-owned methods always take `(tenantId, …)`.

## Security rules

Source of truth: `firebase/firestore.rules`.

Isolation is enforced by active `tenantMemberships/{uid}_{tenantId}` and `request.resource.data.tenantId == tenantId` on writes.

Admin SDK bypasses rules — `resolveTenantMiddleware` verifies membership before setting `res.locals.tenantId`.

## Indexes

`firebase/firestore.indexes.json` — composites for phone lookup, customer/appointment/invoice/quotation/payment queries used by repositories.

## Emulators

```bash
npm run firebase:emulators
```

UI: http://localhost:4000 — Firestore `8081`, Auth `9099`, Storage `9199`, Functions `5001`.

## Seed (dev / emulator only)

```bash
# Terminal 1
npm run firebase:emulators

# Terminal 2
FIRESTORE_EMULATOR_HOST=127.0.0.1:8081 APP_ENV=local SEED_FIRESTORE=1 \
  npm run seed:dev -w @aba/api
```

Refuses production and refuses without emulator unless `ALLOW_SEED_WITHOUT_EMULATOR=1`.

## Tests

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:rules   # requires Java 21+ (Firestore emulator)
```

`test:rules` executes the 8 mandatory tenant-isolation scenarios via `@firebase/rules-unit-testing` + Firestore emulator (`scripts/run-rules-tests.sh`).

## Manual Firebase Console checklist

See section **Manual actions** in the Phase 1 implementation report, or:

1. Create/select Firebase project
2. Enable Authentication (Email/Password, Google as needed)
3. Create Firestore database
4. Create Storage bucket
5. Publish `firebase/firestore.rules`
6. Deploy indexes from `firestore.indexes.json`
7. Create service account → fill API `.env`
8. Authorized domains include `localhost`
