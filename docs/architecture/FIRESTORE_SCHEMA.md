# Firestore Schema Architecture

## Design Rules

1. Every tenant business document includes `tenantId`
2. Prefer subcollections under `tenants/{tenantId}/...` for strongly owned data
3. Top-level collections only when cross-tenant platform queries are required
4. Soft-delete via `deletedAt` (nullable) — hard delete via admin jobs
5. All documents include `createdAt`, `updatedAt`, `createdBy`, `updatedBy` when applicable
6. IDs are Firestore auto-ids unless externally meaningful (`slug`)

---

## Collection Map

### Platform / Global

| Collection | Purpose |
|------------|---------|
| `users/{userId}` | Profile mirror of Auth user |
| `tenants/{tenantId}` | Tenant accounts |
| `tenantMemberships/{membershipId}` | User ↔ Tenant join |
| `tenantInvites/{inviteId}` | Pending invites |
| `plans/{planId}` | SaaS plans |
| `platformConfig/{docId}` | Feature flags, maintenance |
| `auditLogs/{logId}` | Platform-level audit (optional) |

### Tenant Subcollections (`tenants/{tenantId}/...`)

| Path | Purpose |
|------|---------|
| `customers/{customerId}` | CRM contacts |
| `appointments/{appointmentId}` | Appointments |
| `bookings/{bookingId}` | Bookings / reservations |
| `conversations/{conversationId}` | Omnichannel inbox threads |
| `conversations/{id}/messages/{messageId}` | Messages |
| `staff/{staffId}` | Staff profiles |
| `services/{serviceId}` | Service catalog |
| `products/{productId}` | Retail inventory items |
| `inventoryMovements/{id}` | Stock movements |
| `invoices/{invoiceId}` | Invoices |
| `invoiceItems/{itemId}` | Line items (or embedded) |
| `locations/{locationId}` | Branches |
| `properties/{propertyId}` | Real estate listings |
| `vehicles/{vehicleId}` | Car rental fleet |
| `events/{eventId}` | Event company records |
| `membershipPlans/{planId}` | Gym membership products |
| `memberSubscriptions/{id}` | Gym member subscriptions |
| `menuCategories/{id}` | Restaurant menu |
| `menuItems/{id}` | Restaurant items |
| `calendarConnections/{id}` | Google Calendar OAuth |
| `whatsappConfig/{id}` | WhatsApp business config |
| `aiConfigs/{id}` | AI settings / prompts overrides |
| `aiLogs/{logId}` | AI usage & action audit |
| `files/{fileId}` | Storage metadata |
| `notifications/{id}` | In-app notifications |
| `reports/{reportId}` | Saved reports |
| `settings/{settingId}` | Tenant settings docs |
| `webhooks/{webhookId}` | Outbound webhooks (future) |
| `usage/{periodId}` | Quota counters |

### Top-Level Join Indexes (optional)

| Collection | Purpose |
|------------|---------|
| `customerPhones/{hash}` | Dedupe / lookup aids (tenant-scoped fields) |

Prefer composite indexes on subcollections first.

---

## Document Shape Examples (Contracts Only)

### Tenant

```ts
{
  id: string
  name: string
  slug: string
  vertical: Vertical
  locale: "ar" | "en" | "ar-en"
  timezone: "Asia/Kuwait"
  currency: "KWD"
  planId: string
  status: "trialing" | "active" | "suspended" | "cancelled"
  branding: { logoUrl?: string; primaryColor?: string }
  featureFlags: Record<string, boolean>
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Customer

```ts
{
  id: string
  tenantId: string
  fullName: string
  fullNameAr?: string
  phone: string          // E.164 +965...
  email?: string
  tags: string[]
  source: "manual" | "whatsapp" | "booking" | "import"
  metadata: Record<string, unknown>
  deletedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Appointment

```ts
{
  id: string
  tenantId: string
  customerId: string
  staffId?: string
  serviceId?: string
  locationId?: string
  startsAt: Timestamp
  endsAt: Timestamp
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"
  notes?: string
  calendarEventId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## Indexing Strategy

Composite indexes (examples):

- `customers`: `tenantId` + `phone`
- `customers`: `tenantId` + `updatedAt` desc
- `appointments`: `tenantId` + `startsAt`
- `appointments`: `tenantId` + `staffId` + `startsAt`
- `conversations`: `tenantId` + `status` + `lastMessageAt`
- `invoices`: `tenantId` + `status` + `issuedAt`

Defined in `firebase/firestore.indexes.json` and `firebase/firestore/indexes/`.

---

## Soft Delete & Retention

- Soft delete filters: `deletedAt == null`
- GDPR / PDPL-style export/delete jobs under `jobs/`
- Kuwait data residency: document hosting region choice in Firebase project setup (ADR)

---

## Migration Discipline

- Additive fields preferred
- Breaking changes require versioned migration scripts in `scripts/migrations/`
- Never rename fields without dual-read period
