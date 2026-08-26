# Coding Standards

## Language & Tooling

- TypeScript **strict** mode in all packages
- ESLint + Prettier (shared via `packages/config`)
- No JavaScript source files in `apps/` or `packages/` (config exceptions only)
- Node LTS for API; Vite for web

## Architecture Rules

1. **Feature / module isolation** — import via public `index.ts` barrels only
2. **No circular dependencies** between features/modules
3. **Dependency direction:** UI → hooks/services → API → domain services → repositories → Firestore
4. **Shared contracts** live in `@aba/shared`, not duplicated
5. **Side effects** only at edges (controllers, React effects, jobs)

## SOLID Applied

| Principle | Practice |
|-----------|----------|
| S | One module = one business capability |
| O | Vertical packs extend via composition, not forks |
| L | Repository interfaces swappable for tests |
| I | Narrow service interfaces per use-case |
| D | Adapters for OpenAI, WhatsApp, Calendar, PDF |

## React Standards

- Function components only
- React Hook Form + Zod resolvers for forms
- TanStack Query for server state; Zustand for client/UI state
- No data fetching inside presentational components
- Prefer composition over prop drilling; Context for tenant/auth/locale
- Framer Motion for intentional UX motion only (not decoration spam)
- Accessible Shadcn primitives; keyboard + screen reader support

## Express Standards

- Async handlers wrapped with `asyncHandler`
- Validate every mutating request with Zod
- Never pass `req.body` straight to Firestore
- Always bind `tenantId` from middleware context
- Structured logging (JSON) with `requestId` + `tenantId` + `userId`

## Testing Expectations (Foundation)

| Layer | Tooling (planned) |
|-------|-------------------|
| Unit | Vitest |
| API integration | Supertest + emulators |
| E2E | Playwright |
| Rules | Firebase emulators |

## i18n & Kuwait Localization

- All UI strings via i18n keys (`en`, `ar`)
- RTL support when locale is Arabic
- Currency display: KWD with 3 decimal places where required
- Dates: `Asia/Kuwait`
- Phone: normalize to E.164 `+965########`

## Comments & Docs

- Prefer clear naming over comments
- Comment *why*, not *what*
- Public package APIs get JSDoc
- Architecture changes require ADR in `docs/decisions/`

## Forbidden

- `any` without justification
- Committing `.env` secrets
- Cross-tenant queries
- Business logic in React components
- Direct Firestore writes from client for core mutations (v1)
- Copy-pasting Zod schemas across FE/BE (use shared)
