# Naming Conventions

## General

| Item | Convention | Example |
|------|------------|---------|
| Folders | `kebab-case` | `ai-assistant`, `services-catalog` |
| React components | `PascalCase` | `CustomerTable.tsx` |
| Hooks | `camelCase` + `use` prefix | `useCustomersQuery.ts` |
| Utilities | `camelCase` | `formatKwd.ts` |
| Constants | `SCREAMING_SNAKE` or const object | `MAX_PAGE_SIZE` |
| Types / Interfaces | `PascalCase` | `Customer`, `CreateCustomerDto` |
| Enums | `PascalCase` + `PascalCase` members | `AppointmentStatus.Confirmed` |
| Zod schemas | `camelCase` + `Schema` | `createCustomerSchema` |
| Zustand stores | `use` + entity + `Store` | `useTenantStore` |
| API routes | plural nouns | `/customers`, `/appointments` |
| Firestore collections | `camelCase` plural | `tenantMemberships` |
| Env vars | `SCREAMING_SNAKE` | `OPENAI_API_KEY` |
| Feature flags | `camelCase` | `whatsappInboxEnabled` |

## File Naming

| Kind | Pattern |
|------|---------|
| Page | `CustomerListPage.tsx` |
| Component | `CustomerForm.tsx` |
| Hook | `useCustomerForm.ts` |
| Service (FE) | `customers.api.ts` |
| Controller | `customers.controller.ts` |
| Service (BE) | `customers.service.ts` |
| Repository | `customers.repository.ts` |
| Validator | `customers.validators.ts` |
| Route | `customers.routes.ts` |
| Types | `customers.types.ts` |
| Test | `customers.service.test.ts` |

## DTO Naming

- `CreateXInput` / `UpdateXInput` — write models
- `XDto` / `XResponse` — API responses
- `XFilters` — list query
- `XEntity` — persistence model (if distinct)

## Git Branches

```
feature/ABA-123-customer-list
bugfix/ABA-456-tenant-header
hotfix/ABA-789-auth-crash
release/1.2.0
```

## Commit Messages

Conventional Commits:

```
feat(customers): add list filters contract
fix(auth): reject missing tenant header
docs(architecture): clarify storage paths
chore(repo): add monorepo folder scaffold
```

## CSS / Tailwind

- Prefer Tailwind utility classes
- Design tokens via CSS variables in `styles/tokens.css`
- Component variants via `cva` (class-variance-authority) with Shadcn

## Arabic Content Fields

When storing bilingual data:

```
fullName
fullNameAr
description
descriptionAr
```

Do not mix languages in a single field.
