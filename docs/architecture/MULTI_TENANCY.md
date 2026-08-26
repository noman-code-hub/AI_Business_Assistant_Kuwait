# Multi-Tenant Architecture

## Model

**Shared infrastructure, logical isolation** (Salesforce / HubSpot style).

- One Firebase project per environment (dev / staging / prod)
- One Firestore database
- Every business document carries `tenantId`
- Users may belong to multiple tenants (agency / franchise support)
- Active tenant selected via `X-Tenant-Id` header (and mirrored in client store)

**Rejected alternatives (for v1):**

- Database-per-tenant — operational cost too high for SME SaaS
- Collection-per-tenant root only without `tenantId` field — breaks cross-collection queries and security rules consistency

---

## Tenant Hierarchy

```
Platform (ABA Kuwait)
 └── Tenant (Business account)
      ├── Branches / Locations (optional)
      ├── Users (memberships + roles)
      ├── Customers / Contacts
      ├── Operational data (appointments, inventory, …)
      ├── Integrations (WhatsApp, Calendar, OpenAI usage)
      └── Subscription / Plan entitlements
```

---

## Core Entities

### Tenant

| Field | Description |
|-------|-------------|
| `id` | Firestore doc id |
| `name` | Legal / trade name |
| `slug` | Public booking URL slug |
| `vertical` | Industry enum |
| `locale` | `ar` \| `en` \| `ar-en` |
| `timezone` | Default `Asia/Kuwait` |
| `currency` | Default `KWD` |
| `planId` | Billing plan |
| `status` | `trialing` \| `active` \| `suspended` \| `cancelled` |
| `settings` | Feature flags, branding, WhatsApp config refs |
| `createdAt` / `updatedAt` | Audit timestamps |

### TenantMembership

| Field | Description |
|-------|-------------|
| `tenantId` | Tenant reference |
| `userId` | Firebase Auth uid |
| `role` | `owner` \| `admin` \| `manager` \| `staff` \| `readonly` |
| `permissions` | Optional permission overrides |
| `status` | `active` \| `invited` \| `disabled` |
| `branchIds` | Optional location scope |

---

## Isolation Guarantees

### Write Path

1. Authenticate Firebase ID token
2. Resolve `tenantId` from header
3. Verify membership in `tenantMemberships`
4. Inject `tenantId` into every create/update (server-side — never trust client body alone)
5. Repository queries always filter `where('tenantId', '==', tenantId)`

### Read Path

Same membership check. Queries without `tenantId` equality are forbidden in repositories.

### Storage Paths

```
tenants/{tenantId}/uploads/{fileId}
tenants/{tenantId}/invoices/{invoiceId}.pdf
tenants/{tenantId}/exports/{exportId}.csv
```

### AI / RAG

Vector / knowledge retrieval must include `tenantId` filter. Cross-tenant retrieval is a P0 security bug.

---

## Tenant Resolution Order

1. `X-Tenant-Id` request header (API)
2. Custom claim active tenant (optional)
3. Single-membership auto-select (UX only)
4. Fail with `TENANT_REQUIRED` if unresolved

---

## Vertical Packs

Tenants choose a vertical at onboarding. Vertical packs control:

- Enabled modules (vehicles vs properties vs menu)
- Default pipelines / statuses
- AI prompt packs
- Sample data templates
- Dashboard widgets

Vertical packs **extend** core CRM — they do not fork the codebase.

---

## Agency / Multi-Business (Future-Ready)

Schema supports:

- One user → many memberships
- Tenant switching UI
- Optional `organizationId` above tenants (reserved field, unused in v1)

---

## Quotas & Plans

Plan limits enforced server-side:

- Max users
- Max WhatsApp conversations / month
- Max AI tokens / month
- Max storage GB
- Enabled modules

Quota checks live in `modules/billing` + middleware `enforceQuota`.
