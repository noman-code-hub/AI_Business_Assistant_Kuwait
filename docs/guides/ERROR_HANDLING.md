# Error Handling Strategy

## Goals

- Predictable API errors for the frontend
- Safe messages for end users (no stack traces)
- Rich diagnostics for logs
- Shared error codes between FE and BE

---

## Error Code Catalog (Shared)

Located conceptually in `packages/shared/src/errors`:

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | Authenticated but not allowed |
| `TENANT_REQUIRED` | 400 | Missing tenant header |
| `TENANT_ACCESS_DENIED` | 403 | Not a member |
| `TENANT_SUSPENDED` | 403 | Tenant inactive |
| `NOT_FOUND` | 404 | Resource missing |
| `VALIDATION_ERROR` | 422 | Zod failure |
| `CONFLICT` | 409 | Duplicate / state conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `QUOTA_EXCEEDED` | 402/429 | Plan limit hit |
| `INTEGRATION_ERROR` | 502 | WhatsApp/OpenAI/Calendar failure |
| `AI_GUARDRAIL_BLOCKED` | 400 | AI action blocked |
| `INTERNAL_ERROR` | 500 | Unexpected |

---

## Backend Pattern

1. Throw typed `AppError(code, message, details?, httpStatus?)`
2. `errorHandler` middleware maps to envelope
3. Log full error with `requestId`, `tenantId`, `uid`, stack (server only)
4. Never leak Firebase Admin / OpenAI raw errors to clients

```
Domain/Service → AppError → errorHandler → ApiErrorEnvelope
```

---

## Frontend Pattern

1. Axios response interceptor maps envelope → typed error
2. TanStack Query `meta` / global handler shows toast for unexpected errors
3. Forms map `VALIDATION_ERROR.details` to field errors
4. `403 TENANT_*` → redirect to tenant picker / unauthorized page
5. `401` → sign out + redirect login

Toast library: **React Hot Toast** (non-blocking).

---

## Boundary Errors

| Boundary | Strategy |
|----------|----------|
| React render | `ErrorBoundary` per route segment |
| Query failures | Retry transient 5xx/network; no retry 4xx |
| Mutations | No silent fail — toast + inline |
| Webhooks | Persist failure + retry job |
| AI tools | Compensate / rollback where possible |

---

## Observability

Every error log includes:

```
requestId | tenantId | userId | code | path | latencyMs
```

Correlation ID returned to client for support tickets.
