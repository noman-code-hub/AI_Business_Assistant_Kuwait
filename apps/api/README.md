# apps/api

Node.js + Express + TypeScript domain API.

## Scripts

```bash
npm run dev -w @aba/api
npm run build -w @aba/api
npm run typecheck -w @aba/api
npm run test -w @aba/api
npm run test:rules -w @aba/api   # needs Firestore emulator
npm run seed:dev -w @aba/api     # guarded; see Phase 1 docs
```

## Ownership

- `src/modules/*` — domain modules (controllers → services → repositories)
- `src/repositories` — tenant-aware Firestore data access
- `src/db` — Admin Firestore/Storage helpers, timestamps, batches
- `src/middleware` — auth, tenant, RBAC, validation, errors
- `src/lib` — logging, response helpers, asyncHandler
- `src/config` — Zod-validated environment

## Pipeline

```
requestId → helmet → cors → rateLimit → bodyParser
→ (authenticate → resolveTenant → authorize → validate) on protected routes
→ controller → errorHandler
```

`resolveTenant` verifies active membership via Admin SDK before trusting `X-Tenant-Id`.

## Local health check

```bash
curl http://localhost:8080/api/v1/health
```

See `docs/architecture/API_ARCHITECTURE.md` and `docs/architecture/PHASE1_FIREBASE_DATABASE.md`.
