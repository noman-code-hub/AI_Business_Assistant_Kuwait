# @aba/config

Shared tooling bases for the monorepo.

| Export | Purpose |
|--------|---------|
| `@aba/config/typescript/*` | Strict TS bases (`base`, `node`, `react`) |
| `@aba/config/eslint/*` | Flat ESLint configs (`base`, `node`, `react`) |
| `@aba/config/prettier` | Prettier defaults |

Consumers extend these from each package's local config files.
