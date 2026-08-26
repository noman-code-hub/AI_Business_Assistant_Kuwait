# Environment Templates

Non-secret, stage-specific overlays. Copy into local `.env` files during bootstrap.

| Stage | Purpose |
|-------|---------|
| `local/` | Developer defaults |
| `development/` | Shared dev project |
| `staging/` | Pre-prod |
| `production/` | Prod |

Secrets never live in git. Use `.env.example` files under `apps/*` as the full contract.

```bash
cp environments/local/api.env apps/api/.env
cp environments/local/web.env apps/web/.env
```
