# Threat Model (Foundation)

## Assets

- Tenant business data (customers, appointments, invoices)
- WhatsApp conversation content
- AI prompts / logs
- OAuth tokens (Google Calendar)
- Billing entitlements

## Trust Boundaries

1. Browser ↔ Firebase Auth
2. Browser ↔ Express API
3. Express ↔ Firestore / Storage
4. Express ↔ OpenAI / Meta / Google
5. Meta Webhooks ↔ Express

## Top Risks & Controls

| Risk | Control |
|------|---------|
| Cross-tenant data leak | Mandatory `tenantId` filters + membership checks |
| IDOR on resource IDs | Repository always scopes by tenant |
| Stolen ID token | Short-lived tokens; revoke memberships server-side |
| Webhook spoofing | Signature verification |
| Prompt injection | AI guards; tool execution with RBAC |
| Secret leakage | Env isolation; no secrets in VITE_ |
| Privilege escalation | Role matrix + claim refresh + membership SoT |
| Storage enumeration | Tenant-prefixed paths + signed URLs |

## Out of Scope for v1 Docs

Full STRIDE worksheets — to be expanded before production launch.
