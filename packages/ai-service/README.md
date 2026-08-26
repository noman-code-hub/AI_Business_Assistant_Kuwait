# packages/ai-service

AI orchestration package (OpenAI).

## Structure

- `agents` — conversation / booking / support agents
- `prompts` — versioned system prompts
- `tools` — function-calling tools executed via API services
- `rag` — tenant-scoped knowledge retrieval
- `guards` — safety / isolation / PII
- `verticals/*` — industry prompt + tool packs

## Invariants

- Always tenant-scoped
- Tools execute only after RBAC checks in API layer
- All actions auditable via `aiLogs`
