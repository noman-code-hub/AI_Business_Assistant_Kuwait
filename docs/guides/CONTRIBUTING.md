# Contributing

## Before Coding Features

1. Read `docs/architecture/ARCHITECTURE.md`
2. Follow folder ownership rules
3. Add/adjust types in `packages/shared` first for new contracts
4. Do not invent parallel structures

## PR Checklist

- [ ] Correct app/package touched
- [ ] Types shared when used by FE + BE
- [ ] Tenant isolation considered
- [ ] Validation on API boundary
- [ ] No secrets committed
- [ ] Docs updated if architecture changes
- [ ] i18n keys for user-facing strings

## Local Development (Planned)

```
pnpm install          # or npm workspaces
pnpm dev:web
pnpm dev:api
firebase emulators:start
```

Exact package manager lock-in will be decided at bootstrap (ADR).
