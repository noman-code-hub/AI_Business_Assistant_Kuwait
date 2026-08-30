# AI Business Assistant Kuwait

Enterprise multi-tenant AI Business Assistant SaaS for Kuwait SMEs  
(Salons · Clinics · Restaurants · Car Rental · Real Estate · Gyms · Retail · Events · Home Services · SMEs)

> **Current phase: Phase 4 — Roles & Permissions (RBAC)** (see [PHASE4_ROLES_PERMISSIONS.md](docs/architecture/PHASE4_ROLES_PERMISSIONS.md)).  
> Phases 1–3 delivered Firebase data, auth UI, and multi-tenant business onboarding. CRM/AI/WhatsApp product APIs continue in later phases.

---

## Documentation Map

### Architecture

| Document | Description |
|----------|-------------|
| [Architecture Overview](docs/architecture/ARCHITECTURE.md) | Master architecture (all layers) |
| [Project Tree](docs/architecture/PROJECT_TREE.md) | Full folder tree |
| [Multi-Tenancy](docs/architecture/MULTI_TENANCY.md) | Tenant isolation model |
| [Auth & Authorization](docs/architecture/AUTH_AUTHORIZATION.md) | Firebase Auth + RBAC |
| [API Architecture](docs/architecture/API_ARCHITECTURE.md) | REST `/api/v1` design |
| [Firestore Schema](docs/architecture/FIRESTORE_SCHEMA.md) | Collections & indexes |
| [Phase 1 Firebase & Database](docs/architecture/PHASE1_FIREBASE_DATABASE.md) | Implemented data layer |
| [Phase 3 Business & Multi-Tenancy](docs/architecture/PHASE3_BUSINESS_MULTI_TENANCY.md) | Onboarding + tenant switcher |
| [Phase 4 Roles & Permissions](docs/architecture/PHASE4_ROLES_PERMISSIONS.md) | RBAC, requirePermission, frontend can() |
| [Phase 5 Main Dashboard](docs/architecture/PHASE5_MAIN_DASHBOARD.md) | Real-data operational dashboard |
| [Security Rules](docs/architecture/SECURITY_RULES.md) | Rules strategy |

### UI / UX Design

| Document | Description |
|----------|-------------|
| [Design Index](docs/design/00-INDEX.md) | UI design entry point |
| [Design System](docs/design/01-DESIGN_SYSTEM.md) | Colors, type, spacing, motion, RTL |
| [Layouts](docs/design/02-LAYOUTS.md) | Auth, Dashboard, Admin, Settings, Empty, Error, Loading |
| [Navigation](docs/design/03-NAVIGATION.md) | Sidebar, navbar, mobile, ⌘K |
| [Components](docs/design/04-COMPONENTS.md) | Reusable component catalog |
| [Page Map](docs/design/05-PAGE_MAP.md) | Full route registry |
| [Page Patterns](docs/design/06-PAGE_PATTERNS.md) | Shared list/detail/form patterns |
| [Component Inventory](docs/design/07-COMPONENT_INVENTORY.md) | File targets for Shadcn wrappers |

### Engineering Guides

| Document | Description |
|----------|-------------|
| [Coding Standards](docs/guides/CODING_STANDARDS.md) | Engineering standards |
| [Naming Conventions](docs/guides/NAMING_CONVENTIONS.md) | Naming rules |
| [Error Handling](docs/guides/ERROR_HANDLING.md) | Error strategy |
| [Git Branch Strategy](docs/guides/GIT_BRANCH_STRATEGY.md) | Branching model |
| [Contributing](docs/guides/CONTRIBUTING.md) | Contribution rules |

---

## Monorepo Layout

```
apps/web          → React 19 + Vite + TypeScript + Tailwind + Shadcn
apps/api          → Node.js + Express + TypeScript
packages/shared   → Shared types, Zod schemas, constants, errors
packages/ai-service → OpenAI agents, prompts, tools, vertical packs
packages/config   → ESLint / TS / Tailwind base configs
firebase/         → Rules, indexes, functions, hosting config
docs/             → Architecture & standards
environments/     → Env templates by stage
```

---

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind, Shadcn UI, React Router, TanStack Query, React Hook Form, Zod, Axios, React Hot Toast, Framer Motion, Zustand  

**Backend:** Node.js, Express.js, TypeScript  

**Cloud:** Firebase Auth, Firestore, Storage, Hosting, Functions  

**Integrations:** OpenAI API, WhatsApp Cloud API, Google Calendar API, PDFKit  

---

## Design Principles

Production-ready · Scalable · Reusable · Modular · Clean Architecture · Feature-based · SOLID · Type-safe · Multi-tenant isolation

---

## Run locally

```bash
npm install
npm run build:shared
npm run dev:web    # http://localhost:5173
npm run dev:api    # http://localhost:8080/api/v1/health
```

```bash
npm run typecheck
npm run lint
npm run build
```

Open **http://localhost:5173** — full premium dashboard with dummy data.

## Next Step

1. Connect Firebase Auth + Express API (when ready)
2. Replace dummy data with real services
3. Keep UI shells and design tokens as the presentation layer

---

## Note on Accidental Scaffold

A nested Vite JavaScript demo may exist at `AI_Business_Assistant_Kuwait/` from an earlier `npm create vite` run. It is **not** part of this architecture. The canonical apps live under `apps/web` and `apps/api`.
