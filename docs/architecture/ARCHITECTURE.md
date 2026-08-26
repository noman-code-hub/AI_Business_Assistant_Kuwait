# AI Business Assistant Kuwait — Enterprise Architecture

> **Status:** Architecture Foundation Only  
> **Scope:** Structure, standards, tenancy, security, and development foundation  
> **Explicitly Out of Scope:** Feature implementation / business logic code

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Folder Structure](#2-frontend-folder-structure)
3. [Backend Folder Structure](#3-backend-folder-structure)
4. [Shared Folder Structure](#4-shared-folder-structure)
5. [Firebase Folder Structure](#5-firebase-folder-structure)
6. [AI Service Folder Structure](#6-ai-service-folder-structure)
7. [Utilities, Hooks, Components, Layouts](#7-utilities-hooks-components-layouts)
8. [Services, Context, API, Routes](#8-services-context-api-routes)
9. [Middleware & Validation](#9-middleware--validation)
10. [Constants, Types, Environment, Assets](#10-constants-types-environment-assets)
11. [Documentation & Git Strategy](#11-documentation--git-strategy)
12. [Coding Standards & Naming](#12-coding-standards--naming)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Authentication Architecture](#14-authentication-architecture)
15. [Authorization Architecture](#15-authorization-architecture)
16. [Multi-Tenant Architecture](#16-multi-tenant-architecture)
17. [Firestore Collections](#17-firestore-collections)
18. [Security Rules Strategy](#18-security-rules-strategy)
19. [API Architecture](#19-api-architecture)
20. [Folder Explanations](#20-folder-explanations)
21. [Complete Project Tree](#21-complete-project-tree)

---

## 1. System Overview

### Product Positioning

Enterprise multi-tenant SaaS comparable to Salesforce / HubSpot / Zoho CRM / GoHighLevel, localized for Kuwait (Arabic + English, KWD, Kuwait business verticals).

### Architectural Style

| Layer | Pattern |
|-------|---------|
| Monorepo | `apps/*` + `packages/*` |
| Frontend | Feature-based Clean Architecture |
| Backend | Modular Domain-Driven Design (DDD-lite) |
| Data | Tenant-isolated Firestore (shared collections + `tenantId`) |
| Auth | Firebase Authentication + custom claims |
| Integrations | Adapter pattern (OpenAI, WhatsApp, Google Calendar, PDFKit) |

### High-Level Flow

```
Client (React) → API Gateway (Express) → Domain Modules → Repositories → Firestore
                                      ↘ AI Service Package → OpenAI
                                      ↘ WhatsApp Adapter → Meta Cloud API
                                      ↘ Calendar Adapter → Google Calendar
                                      ↘ PDF Service → PDFKit → Firebase Storage
```

### Target Verticals

`salon` · `clinic` · `restaurant` · `car_rental` · `real_estate` · `gym` · `retail` · `events` · `home_services` · `sme`

---

## 2. Frontend Folder Structure

```
apps/web/
├── public/
│   ├── assets/{images,icons,fonts}/
│   └── locales/{en,ar}/
├── src/
│   ├── app/                    # App shell: providers, router, layouts
│   │   ├── providers/
│   │   ├── router/
│   │   └── layouts/{root,auth,dashboard,onboarding,public}/
│   ├── assets/
│   ├── components/             # Shared UI only (no feature logic)
│   │   ├── ui/                 # Shadcn primitives
│   │   ├── common/
│   │   ├── forms/
│   │   ├── feedback/
│   │   ├── navigation/
│   │   ├── data-display/
│   │   └── overlays/
│   ├── features/               # Feature modules (co-located)
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── appointments/
│   │   ├── bookings/
│   │   ├── inbox/
│   │   ├── whatsapp/
│   │   ├── ai-assistant/
│   │   ├── calendar/
│   │   ├── inventory/
│   │   ├── invoices/
│   │   ├── staff/
│   │   ├── services-catalog/
│   │   ├── properties/         # Real estate vertical
│   │   ├── vehicles/           # Car rental vertical
│   │   ├── events/
│   │   ├── memberships/        # Gym vertical
│   │   ├── menu/               # Restaurant vertical
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── billing/
│   │   ├── onboarding/
│   │   └── verticals/          # Vertical-specific UI overrides
│   ├── hooks/                  # Global reusable hooks
│   ├── lib/                    # Firebase, Axios, Query, utils
│   ├── stores/                 # Zustand stores
│   ├── context/                # React context (tenant, theme, i18n)
│   ├── services/               # API + Firebase client services
│   ├── config/
│   ├── constants/
│   ├── types/
│   ├── i18n/
│   ├── styles/
│   └── tests/{unit,integration,e2e}/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── components.json             # Shadcn config
```

### Feature Module Contract (every feature)

```
features/<feature>/
├── components/
├── hooks/
├── services/
├── types/
├── schemas/          # Zod (when forms exist)
├── pages/
├── index.ts          # Public barrel export
└── README.md         # Feature boundary notes
```

---

## 3. Backend Folder Structure

```
apps/api/
├── src/
│   ├── app/                    # Express bootstrap, register routes
│   ├── config/                 # Env, Firebase Admin, CORS, rate limits
│   ├── modules/                # Domain modules
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── users/
│   │   ├── customers/
│   │   ├── appointments/
│   │   ├── bookings/
│   │   ├── inbox/
│   │   ├── whatsapp/
│   │   ├── ai/
│   │   ├── calendar/
│   │   ├── invoices/
│   │   ├── inventory/
│   │   ├── staff/
│   │   ├── services-catalog/
│   │   ├── properties/
│   │   ├── vehicles/
│   │   ├── events/
│   │   ├── memberships/
│   │   ├── menu/
│   │   ├── reports/
│   │   ├── billing/
│   │   ├── storage/
│   │   └── webhooks/
│   ├── middleware/             # Auth, tenant, RBAC, validation, errors
│   ├── repositories/           # Cross-cutting data access (optional)
│   ├── services/               # External adapters
│   │   ├── firebase/
│   │   ├── openai/
│   │   ├── whatsapp/
│   │   ├── google-calendar/
│   │   ├── pdf/
│   │   ├── email/
│   │   └── notifications/
│   ├── lib/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   ├── errors/
│   ├── jobs/                   # Background / queue workers
│   ├── events/                 # Domain event bus
│   └── tests/{unit,integration,e2e}/
├── package.json
├── tsconfig.json
└── nodemon.json
```

### Backend Module Contract

```
modules/<domain>/
├── controllers/      # HTTP adapters
├── services/         # Business use-cases
├── routes/           # Express routers
├── validators/       # Zod request schemas
├── repositories/     # Firestore data access
├── types/
└── index.ts
```

**Dependency rule:** `routes → controllers → services → repositories`  
Controllers never call Firestore directly. Repositories never call OpenAI/WhatsApp.

---

## 4. Shared Folder Structure

```
packages/
├── shared/
│   └── src/
│       ├── types/          # Shared DTOs & domain types
│       ├── constants/      # Roles, verticals, statuses
│       ├── enums/
│       ├── schemas/        # Shared Zod schemas
│       ├── validators/
│       ├── utils/
│       ├── errors/         # Error codes shared FE/BE
│       └── index.ts
├── ai-service/             # AI orchestration package
├── config/
│   ├── eslint/
│   ├── typescript/
│   └── tailwind/
```

### Shared Ownership Rules

| Package | Owns |
|---------|------|
| `@aba/shared` | Types, enums, Zod schemas, error codes, constants |
| `@aba/ai-service` | Agents, prompts, tools, RAG, vertical AI configs |
| `@aba/config` | ESLint / TS / Tailwind base configs |

---

## 5. Firebase Folder Structure

```
firebase/
├── firebase.json
├── .firebaserc
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── functions/
│   └── src/
│       ├── triggers/       # onCreate / onUpdate / onDelete
│       ├── scheduled/      # Cron jobs
│       ├── callables/      # Callable HTTPS functions
│       ├── http/           # HTTP endpoints (webhooks if needed)
│       └── utils/
├── firestore/
│   └── indexes/
├── storage/
├── hosting/
├── extensions/
├── emulators/
└── rules/
```

### Firebase Responsibilities

| Surface | Responsibility |
|---------|----------------|
| Auth | Identity providers, MFA, custom claims |
| Firestore | System of record (tenant-scoped) |
| Storage | Media, PDFs, exports (tenant-prefixed paths) |
| Hosting | SPA (`apps/web` build) |
| Functions | Async triggers, scheduled jobs, webhook relays |

Primary REST API lives in `apps/api` (Express). Cloud Functions complement — they do not replace the API layer.

---

## 6. AI Service Folder Structure

```
packages/ai-service/src/
├── agents/             # Conversation, booking, support agents
├── prompts/            # System / tool prompts (versioned)
├── tools/              # Function-calling tools (book, search, invoice)
├── memory/             # Session / conversation memory adapters
├── rag/                # Knowledge retrieval (tenant docs)
├── guards/             # PII, hallucination, tenant isolation guards
├── providers/          # OpenAI client wrapper
├── verticals/          # Per-industry prompt + tool packs
│   ├── salon/
│   ├── clinic/
│   ├── restaurant/
│   ├── car-rental/
│   ├── real-estate/
│   ├── gym/
│   ├── retail/
│   ├── events/
│   ├── home-services/
│   └── sme/
├── types/
├── utils/
└── index.ts
```

### AI Design Principles

1. **Tenant-scoped context only** — never cross-tenant retrieval.
2. **Tool-first** — AI proposes actions; backend services execute with RBAC.
3. **Vertical packs** — industry prompts/tools loaded by `tenant.vertical`.
4. **Auditability** — every AI action logged under `tenants/{id}/aiLogs`.
5. **Human-in-the-loop flags** — high-risk actions require confirmation.

---

## 7. Utilities, Hooks, Components, Layouts

### Utilities (`apps/web/src/lib/utils`, `apps/api/src/utils`)

- Date/time (Asia/Kuwait)
- Currency (KWD formatting)
- Phone (Kuwait `+965` normalization)
- i18n helpers (RTL/LTR)
- ID generators, slug helpers
- Permission checkers (client-side UX only — server is source of truth)

### Hooks (`apps/web/src/hooks` + feature hooks)

| Hook | Purpose |
|------|---------|
| `useAuth` | Current user session |
| `useTenant` | Active tenant context |
| `usePermissions` | Capability checks for UI |
| `useDebounce` | Search / filters |
| `useMediaQuery` | Responsive layout |
| `useLocale` | en / ar + RTL |

Feature hooks live inside `features/*/hooks` and must not import other features' internals.

### Components

- `components/ui` → Shadcn only
- `components/common` → Logo, PageHeader, EmptyState, ErrorBoundary
- `components/forms` → FormField wrappers over RHF + Zod
- Feature components stay inside features

### Layouts

| Layout | Used for |
|--------|----------|
| `root` | Global shell, providers |
| `auth` | Login / register / reset |
| `dashboard` | Authenticated SaaS console |
| `onboarding` | Tenant setup wizard |
| `public` | Booking pages, marketing |

---

## 8. Services, Context, API, Routes

### Frontend Services

```
services/
├── api/                 # Axios resource clients
│   ├── clients.ts
│   ├── customers.api.ts
│   ├── appointments.api.ts
│   └── ...
└── firebase/
    ├── auth.service.ts
    ├── storage.service.ts
    └── firestore.service.ts   # Rare direct reads only
```

Prefer **API for mutations and business rules**. Direct Firestore reads only for realtime listeners when justified.

### Context

```
context/
├── AuthContext.tsx
├── TenantContext.tsx
├── ThemeContext.tsx
└── LocaleContext.tsx
```

Zustand stores hold UI/session cache; Context holds cross-tree provider boundaries.

### Frontend Route Structure

```
/                           → marketing / redirect
/login
/register
/forgot-password
/onboarding/*
/app                        → dashboard shell
  /app/dashboard
  /app/customers
  /app/appointments
  /app/bookings
  /app/inbox
  /app/whatsapp
  /app/ai
  /app/calendar
  /app/inventory
  /app/invoices
  /app/staff
  /app/services
  /app/properties           # vertical-gated
  /app/vehicles             # vertical-gated
  /app/events               # vertical-gated
  /app/memberships          # vertical-gated
  /app/menu                 # vertical-gated
  /app/reports
  /app/settings/*
  /app/billing
/book/:tenantSlug           → public booking
/unauthorized
/*
```

Vertical-gated routes resolve from `tenant.vertical` + feature flags.

### Backend Route Structure

```
/api/v1/health
/api/v1/auth/*
/api/v1/tenants/*
/api/v1/users/*
/api/v1/customers/*
/api/v1/appointments/*
/api/v1/bookings/*
/api/v1/inbox/*
/api/v1/whatsapp/*
/api/v1/ai/*
/api/v1/calendar/*
/api/v1/invoices/*
/api/v1/inventory/*
/api/v1/staff/*
/api/v1/services/*
/api/v1/properties/*
/api/v1/vehicles/*
/api/v1/events/*
/api/v1/memberships/*
/api/v1/menu/*
/api/v1/reports/*
/api/v1/billing/*
/api/v1/storage/*
/api/v1/webhooks/whatsapp
/api/v1/webhooks/stripe      # future
```

All tenant-scoped routes require: `authenticate` → `resolveTenant` → `authorize`.

---

## 9. Middleware & Validation

### Middleware Pipeline (order)

```
1. requestId
2. helmet / security headers
3. cors
4. rateLimit
5. bodyParser
6. authenticate          # Firebase ID token
7. resolveTenant         # X-Tenant-Id or claim
8. authorize             # RBAC / permissions
9. validate(schema)      # Zod
10. controller
11. errorHandler         # last
```

### Middleware Files

```
middleware/
├── authenticate.ts
├── resolveTenant.ts
├── authorize.ts
├── validateRequest.ts
├── rateLimit.ts
├── requestId.ts
├── auditLog.ts
└── errorHandler.ts
```

### Validation Structure

| Layer | Tool | Location |
|-------|------|----------|
| Shared DTO schemas | Zod | `packages/shared/src/schemas` |
| API request/response | Zod | `modules/*/validators` |
| Frontend forms | Zod + RHF | `features/*/schemas` |

**Rule:** Frontend schemas may be stricter for UX; backend schemas are authoritative.

---

## 10. Constants, Types, Environment, Assets

### Constants

```
packages/shared/src/constants/
├── roles.ts
├── permissions.ts
├── verticals.ts
├── statuses.ts
├── locales.ts
├── currencies.ts          # KWD primary
└── limits.ts              # Plan quotas
```

### Types

```
packages/shared/src/types/
├── auth.types.ts
├── tenant.types.ts
├── user.types.ts
├── customer.types.ts
├── appointment.types.ts
├── booking.types.ts
├── invoice.types.ts
├── ai.types.ts
├── whatsapp.types.ts
├── api.types.ts           # ApiResponse<T>, Paginated<T>
└── common.types.ts
```

### Environment Structure

```
environments/
├── local/
├── development/
├── staging/
└── production/

apps/web/.env.example
apps/api/.env.example
```

Variables are namespaced:

```
VITE_FIREBASE_*
VITE_API_BASE_URL
VITE_APP_ENV

FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
OPENAI_API_KEY
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
GOOGLE_CALENDAR_CLIENT_ID
GOOGLE_CALENDAR_CLIENT_SECRET
JWT_CLOCK_SKEW_SECONDS
CORS_ORIGINS
```

Never commit real secrets. Use Secret Manager / CI secrets in staging & production.

### Assets

```
apps/web/public/assets/     # Static CDN-served
apps/web/src/assets/        # Bundled assets
apps/web/public/locales/    # i18n JSON
```

---

## 11. Documentation & Git Strategy

### Documentation Folder

```
docs/
├── architecture/
│   ├── ARCHITECTURE.md          # This file
│   ├── MULTI_TENANCY.md
│   ├── AUTH_AUTHORIZATION.md
│   ├── API_ARCHITECTURE.md
│   ├── FIRESTORE_SCHEMA.md
│   └── SECURITY_RULES.md
├── guides/
│   ├── CODING_STANDARDS.md
│   ├── NAMING_CONVENTIONS.md
│   ├── ERROR_HANDLING.md
│   ├── GIT_BRANCH_STRATEGY.md
│   └── CONTRIBUTING.md
├── api/
│   └── OPENAPI.md               # Spec placeholder
├── security/
│   └── THREAT_MODEL.md
└── decisions/                   # ADRs
    └── 0001-monorepo.md
```

### Git Branch Strategy

See `docs/guides/GIT_BRANCH_STRATEGY.md`.

**Model:** GitFlow-lite

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready |
| `develop` | Integration |
| `feature/*` | Features |
| `bugfix/*` | Fixes |
| `hotfix/*` | Prod emergencies |
| `release/*` | Release hardening |

---

## 12. Coding Standards & Naming

See detailed guides:

- `docs/guides/CODING_STANDARDS.md`
- `docs/guides/NAMING_CONVENTIONS.md`

**Highlights:**

- TypeScript `strict: true` everywhere
- No `any` without eslint-disable + justification comment
- Feature barrels; no deep cross-feature imports
- SOLID + Clean Architecture boundaries enforced by folder ownership
- Arabic/English: all user-facing strings via i18n keys

---

## 13. Error Handling Strategy

See `docs/guides/ERROR_HANDLING.md`.

**Pattern:** Domain error codes → HTTP mapping → typed API envelope.

```ts
{
  success: false,
  error: {
    code: "TENANT_ACCESS_DENIED",
    message: "You do not have access to this tenant",
    details?: unknown,
    requestId: "..."
  }
}
```

---

## 14–16. Auth, Authorization, Multi-Tenancy

Detailed in:

- `docs/architecture/AUTH_AUTHORIZATION.md`
- `docs/architecture/MULTI_TENANCY.md`

**Summary:**

- Firebase Auth for identity
- Custom claims: `{ uid, tenants: { [tenantId]: role } }`
- Every Firestore document includes `tenantId`
- Server middleware enforces tenant membership on every request
- Client never trusted for authorization

---

## 17–18. Firestore & Security Rules

Detailed in:

- `docs/architecture/FIRESTORE_SCHEMA.md`
- `docs/architecture/SECURITY_RULES.md`

---

## 19. API Architecture

Detailed in `docs/architecture/API_ARCHITECTURE.md`.

---

## 20. Folder Explanations

| Path | Why it exists |
|------|----------------|
| `apps/web` | SPA — React 19 + Vite |
| `apps/api` | Express domain API |
| `packages/shared` | Single source of truth for contracts |
| `packages/ai-service` | Isolated AI complexity |
| `packages/config` | Shared tooling configs |
| `firebase/` | IaC-adjacent Firebase assets |
| `docs/` | Living architecture |
| `environments/` | Env templates by stage |
| `scripts/` | Scaffold / migrate / seed helpers |
| `features/*` | Product domains (HubSpot-style objects) |
| `verticals/*` | Industry packs (GHL-style snapshots) |
| `middleware/` | Cross-cutting HTTP concerns |
| `repositories/` | Firestore isolation boundary |

---

## 21. Complete Project Tree

See `docs/architecture/PROJECT_TREE.md`.

---

## Architecture Decision Records (Initial)

| ADR | Decision |
|-----|----------|
| ADR-001 | Monorepo with apps + packages |
| ADR-002 | Shared Firestore + `tenantId` isolation (not DB-per-tenant) |
| ADR-003 | Express API as primary backend; Functions for async |
| ADR-004 | Feature-based frontend modules |
| ADR-005 | Zod as single validation language FE/BE |
| ADR-006 | Custom claims + membership docs for RBAC |
| ADR-007 | Vertical packs for industry customization |

---

## Next Phase (Not This Task)

When approved, implementation order:

1. Tooling bootstrap (TS, ESLint, Tailwind, Shadcn, workspace)
2. Firebase project + Auth + rules skeleton
3. Auth + Tenant middleware
4. Core CRM modules (customers, appointments)
5. Integrations (WhatsApp, Calendar, AI, PDF)
6. Vertical packs
7. Billing / plans

**Do not implement features until architecture is approved.**
