# apps/api

Node.js + Express + TypeScript domain API.

## Ownership

- `src/modules/*` — domain modules (controllers → services → repositories)
- `src/middleware` — auth, tenant, RBAC, validation, errors
- `src/services` — external adapters (Firebase, OpenAI, WhatsApp, Calendar, PDF)
- `src/jobs` / `src/events` — async processing

## Rules

- Dependency direction: routes → controllers → services → repositories
- Every tenant route: authenticate → resolveTenant → authorize → validate
- Never trust client-supplied `tenantId` for authorization without membership check

See `docs/architecture/API_ARCHITECTURE.md`.
