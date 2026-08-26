# packages/shared

Single source of truth for:

- Domain types / DTOs (`src/types`)
- Enums & constants — roles, verticals, statuses (`src/constants`)
- Zod schemas shared by FE + BE (`src/schemas`)
- Validation helpers (`src/validators`)
- Error codes + `AppError` (`src/errors`)
- Shared utils (`src/utils`)

```bash
npm run build -w @aba/shared
```

Consumers: `apps/web`, `apps/api`, `packages/ai-service`.
