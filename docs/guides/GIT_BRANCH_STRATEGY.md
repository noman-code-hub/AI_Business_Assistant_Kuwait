# Git Branch Strategy

## Model: GitFlow-Lite

```
main  ←── hotfix/* 
  ↑
release/*
  ↑
develop ←── feature/* , bugfix/*
```

---

## Branches

| Branch | Protected | Purpose |
|--------|-----------|---------|
| `main` | Yes | Production |
| `develop` | Yes | Integration / staging deploy |
| `feature/<ticket>-<slug>` | No | New work |
| `bugfix/<ticket>-<slug>` | No | Non-prod bugs |
| `hotfix/<ticket>-<slug>` | No | Prod emergencies |
| `release/<semver>` | No | Release freeze / QA |

---

## Workflow

1. Branch from `develop` for features/bugfixes
2. Open PR into `develop`
3. Require: lint, typecheck, unit tests, review
4. Cut `release/x.y.z` from `develop` when ready
5. Merge release → `main` and back into `develop`
6. Tag `vX.Y.Z` on `main`
7. Hotfixes branch from `main`, merge to `main` + `develop`

---

## Environments ↔ Branches

| Environment | Branch / Trigger |
|-------------|------------------|
| Local | developer machine |
| Development | `develop` auto-deploy |
| Staging | `release/*` or staging channel |
| Production | tagged `main` |

---

## Commit & PR Rules

- Conventional Commits
- Small PRs preferred (one feature/module slice)
- Architecture changes must update `docs/`
- No secrets in git history
- `main` and `develop` require reviews

---

## Monorepo Considerations

- Path-filtered CI (`apps/web`, `apps/api`, `packages/*`)
- Shared package changes run all dependent test suites
- Version packages together for v1 (no independent semver yet)

---

## Release Checklist (Foundation)

- [ ] Typecheck all packages
- [ ] Lint
- [ ] Unit tests
- [ ] Firestore rules tests
- [ ] Staging smoke (auth, tenant switch, one CRUD)
- [ ] Changelog updated
- [ ] Tag created
