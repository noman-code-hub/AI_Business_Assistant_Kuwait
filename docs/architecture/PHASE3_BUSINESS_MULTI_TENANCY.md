# Phase 3 — Business Registration & Multi-Tenancy

## Canonical identity

- **Collection:** `tenants` (Business alias)
- **tenantId** = Firestore document id of the tenant
- **Membership:** `tenantMemberships/{userId}_{tenantId}` with role `owner` on create

Client-supplied `tenantId` is **never** trusted for create.  
`X-Tenant-Id` is verified against active membership in `resolveTenantMiddleware`.

## APIs

| Method | Path | Auth | Tenant header |
|--------|------|------|----------------|
| POST | `/api/v1/tenants` | Required | No — creates business |
| GET | `/api/v1/tenants` | Required | No — list mine |
| GET | `/api/v1/tenants/:businessId` | Required | No — membership check |
| GET/POST | `/api/v1/customers` | Required | Yes (`X-Tenant-Id`) |
| GET | `/api/v1/customers/:customerId` | Required | Yes |
| GET/POST | `/api/v1/services` | Required | Yes |

Create business uses Firestore **batch** (tenant + membership + services) and optional `Idempotency-Key`.

## Frontend

- `/onboarding` — 6-step wizard (draft in localStorage)
- Business switcher in top nav
- No business → redirect to onboarding
- Active tenant stored in `localStorage` (`aba:activeTenantId`), validated against memberships

## Manual publish

1. Publish updated `firebase/firestore.rules` (tenant/membership create = Admin only)
2. Publish `firebase/storage.rules` (user logo uploads)
3. Run API with Firebase Admin env: `npm run dev:api`
4. Run web: `npm run dev:web`
