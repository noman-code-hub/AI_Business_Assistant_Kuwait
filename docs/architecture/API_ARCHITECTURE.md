# API Architecture

## Style

**Versioned REST JSON API** — `/api/v1`

GraphQL deferred. Internal RPC not exposed.

---

## Responsibilities

| Component | Role |
|-----------|------|
| Express API | Business rules, integrations, tenancy, RBAC |
| Firebase Auth | Identity |
| Firestore | Persistence |
| Cloud Functions | Async triggers, schedules, fan-out |
| Frontend | UX, caching via TanStack Query |

---

## Request Envelope

### Headers

```
Authorization: Bearer <firebase_id_token>
X-Tenant-Id: <tenantId>
X-Request-Id: <uuid>          # optional client; server always sets
Accept-Language: ar | en
```

### Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "uuid",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 135,
      "hasMore": true
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number",
    "details": [{ "path": "phone", "message": "Must be E.164" }],
    "requestId": "uuid"
  }
}
```

---

## Versioning

- URL version: `/api/v1`
- Breaking changes → `/api/v2`
- Deprecation headers for sunset timelines

---

## Module Routing Pattern

```
modules/customers/
  routes/customers.routes.ts
  controllers/customers.controller.ts
  services/customers.service.ts
  repositories/customers.repository.ts
  validators/customers.validators.ts
```

Router registration in `app/registerRoutes.ts`.

---

## Pagination, Filtering, Sorting

Standard query params:

```
?page=1&pageSize=20
&sortBy=updatedAt&sortOrder=desc
&search=ahmad
&status=active
&from=2026-01-01&to=2026-01-31
```

Max `pageSize` = 100 (enforced).

---

## Idempotency

Mutating WhatsApp / payment / invoice endpoints accept:

```
Idempotency-Key: <uuid>
```

Stored per tenant for 24h.

---

## Rate Limiting

| Scope | Limit (baseline) |
|-------|------------------|
| Public | 60 req/min/IP |
| Authenticated | 300 req/min/user |
| AI endpoints | Plan-based |
| WhatsApp send | Plan-based + Meta limits |

---

## Webhooks

```
POST /api/v1/webhooks/whatsapp
```

- Signature verification
- Raw body capture
- Fast ACK + async processing via jobs/events

---

## OpenAPI

Contract documented in `docs/api/OPENAPI.md` and generated from Zod later (`zod-to-openapi`).

---

## Controllers vs Services

- Controllers: parse HTTP, call services, map errors
- Services: orchestrate use-cases, transactions, external adapters
- Repositories: Firestore only

No business logic in routes or middleware beyond authz/validation.
