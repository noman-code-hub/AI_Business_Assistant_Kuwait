# Complete Project Tree

> Architecture scaffold only — no feature implementation.

```
AI_Business_Assistant_Kuwait/
├── README.md
├── package.json                          # workspace root (to be configured)
├── pnpm-workspace.yaml                   # or npm/nx workspaces
├── .gitignore
├── .editorconfig
├── .nvmrc
│
├── docs/
│   ├── architecture/
│   │   ├── ARCHITECTURE.md
│   │   ├── MULTI_TENANCY.md
│   │   ├── AUTH_AUTHORIZATION.md
│   │   ├── API_ARCHITECTURE.md
│   │   ├── FIRESTORE_SCHEMA.md
│   │   ├── SECURITY_RULES.md
│   │   └── PROJECT_TREE.md
│   ├── guides/
│   │   ├── CODING_STANDARDS.md
│   │   ├── NAMING_CONVENTIONS.md
│   │   ├── ERROR_HANDLING.md
│   │   ├── GIT_BRANCH_STRATEGY.md
│   │   └── CONTRIBUTING.md
│   ├── api/
│   │   └── OPENAPI.md
│   ├── security/
│   │   └── THREAT_MODEL.md
│   └── decisions/
│       ├── 0001-monorepo.md
│       ├── 0002-tenant-isolation.md
│       └── 0003-api-vs-functions.md
│
├── environments/
│   ├── local/
│   ├── development/
│   ├── staging/
│   └── production/
│
├── scripts/                              # codegen, migrations, seeds
├── tools/                                # internal CLIs
│
├── packages/
│   ├── shared/
│   │   └── src/
│   │       ├── types/
│   │       ├── constants/
│   │       ├── enums/
│   │       ├── schemas/
│   │       ├── validators/
│   │       ├── utils/
│   │       ├── errors/
│   │       └── index.ts
│   ├── ai-service/
│   │   └── src/
│   │       ├── agents/
│   │       ├── prompts/
│   │       ├── tools/
│   │       ├── memory/
│   │       ├── rag/
│   │       ├── guards/
│   │       ├── providers/
│   │       ├── verticals/
│   │       │   ├── salon/
│   │       │   ├── clinic/
│   │       │   ├── restaurant/
│   │       │   ├── car-rental/
│   │       │   ├── real-estate/
│   │       │   ├── gym/
│   │       │   ├── retail/
│   │       │   ├── events/
│   │       │   ├── home-services/
│   │       │   └── sme/
│   │       ├── types/
│   │       ├── utils/
│   │       └── index.ts
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── apps/
│   ├── web/                              # React 19 + Vite + TS
│   │   ├── public/
│   │   │   ├── assets/{images,icons,fonts}/
│   │   │   └── locales/{en,ar}/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── providers/
│   │   │   │   ├── router/
│   │   │   │   └── layouts/
│   │   │   │       ├── root/
│   │   │   │       ├── auth/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── onboarding/
│   │   │   │       └── public/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── ui/                 # Shadcn
│   │   │   │   ├── common/
│   │   │   │   ├── forms/
│   │   │   │   ├── feedback/
│   │   │   │   ├── navigation/
│   │   │   │   ├── data-display/
│   │   │   │   └── overlays/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── tenants/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── customers/
│   │   │   │   ├── appointments/
│   │   │   │   ├── bookings/
│   │   │   │   ├── inbox/
│   │   │   │   ├── whatsapp/
│   │   │   │   ├── ai-assistant/
│   │   │   │   ├── calendar/
│   │   │   │   ├── inventory/
│   │   │   │   ├── invoices/
│   │   │   │   ├── staff/
│   │   │   │   ├── services-catalog/
│   │   │   │   ├── properties/
│   │   │   │   ├── vehicles/
│   │   │   │   ├── events/
│   │   │   │   ├── memberships/
│   │   │   │   ├── menu/
│   │   │   │   ├── reports/
│   │   │   │   ├── settings/
│   │   │   │   ├── billing/
│   │   │   │   ├── onboarding/
│   │   │   │   └── verticals/
│   │   │   ├── hooks/
│   │   │   ├── lib/{firebase,axios,query,utils}/
│   │   │   ├── stores/                 # Zustand
│   │   │   ├── context/
│   │   │   ├── services/{api,firebase}/
│   │   │   ├── config/
│   │   │   ├── constants/
│   │   │   ├── types/
│   │   │   ├── i18n/
│   │   │   ├── styles/
│   │   │   └── tests/{unit,integration,e2e}/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── components.json
│   │   └── .env.example
│   │
│   └── api/                              # Node + Express + TS
│       ├── src/
│       │   ├── app/
│       │   ├── config/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── tenants/
│       │   │   ├── users/
│       │   │   ├── customers/
│       │   │   ├── appointments/
│       │   │   ├── bookings/
│       │   │   ├── inbox/
│       │   │   ├── whatsapp/
│       │   │   ├── ai/
│       │   │   ├── calendar/
│       │   │   ├── invoices/
│       │   │   ├── inventory/
│       │   │   ├── staff/
│       │   │   ├── services-catalog/
│       │   │   ├── properties/
│       │   │   ├── vehicles/
│       │   │   ├── events/
│       │   │   ├── memberships/
│       │   │   ├── menu/
│       │   │   ├── reports/
│       │   │   ├── billing/
│       │   │   ├── storage/
│       │   │   └── webhooks/
│       │   ├── middleware/
│       │   ├── repositories/
│       │   ├── services/
│       │   │   ├── firebase/
│       │   │   ├── openai/
│       │   │   ├── whatsapp/
│       │   │   ├── google-calendar/
│       │   │   ├── pdf/
│       │   │   ├── email/
│       │   │   └── notifications/
│       │   ├── lib/
│       │   ├── utils/
│       │   ├── constants/
│       │   ├── types/
│       │   ├── errors/
│       │   ├── jobs/
│       │   ├── events/
│       │   └── tests/{unit,integration,e2e}/
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
│
└── firebase/
    ├── firebase.json
    ├── .firebaserc
    ├── firestore.rules
    ├── firestore.indexes.json
    ├── storage.rules
    ├── functions/src/{triggers,scheduled,callables,http,utils}/
    ├── firestore/indexes/
    ├── storage/
    ├── hosting/
    ├── extensions/
    ├── emulators/
    └── rules/
```

Each feature/module folder follows the contracts defined in `ARCHITECTURE.md`.
