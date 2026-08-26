# ADR-0001: Monorepo Structure

## Status

Accepted

## Context

The platform includes a React SPA, Express API, shared contracts, AI orchestration, and Firebase assets. Multiple repos would slow contract changes and increase version drift.

## Decision

Use a monorepo:

- `apps/web` — frontend
- `apps/api` — backend
- `packages/shared` — types/schemas/constants
- `packages/ai-service` — AI domain package
- `packages/config` — tooling
- `firebase/` — Firebase project files
- `docs/` — architecture

## Consequences

+ Atomic cross-cutting changes  
+ Single CI with path filters  
− Requires workspace tooling discipline  
