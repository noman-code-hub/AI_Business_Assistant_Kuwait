# Environment Templates

Place non-secret, stage-specific overlays here during bootstrap:

- `local/` — developer defaults
- `development/` — shared dev project
- `staging/` — pre-prod
- `production/` — prod

Secrets never live in git. Use `.env.example` files under `apps/*` as the contract.
