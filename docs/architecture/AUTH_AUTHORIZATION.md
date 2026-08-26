# Authentication & Authorization Architecture

## Authentication (Who are you?)

### Provider

**Firebase Authentication** is the sole identity provider for v1.

Supported methods (planned):

- Email / Password
- Google Sign-In
- Phone (Kuwait `+965`) — optional later
- Password reset via Firebase

### Token Flow

```
Client signs in with Firebase Auth
 → receives ID Token
 → Axios interceptor attaches Authorization: Bearer <token>
 → API middleware verifies token via Firebase Admin
 → attaches req.user = { uid, email, claims }
```

### Custom Claims (lightweight)

```json
{
  "platformRole": "user" | "superadmin",
  "tenants": {
    "tenant_abc": "owner",
    "tenant_xyz": "staff"
  }
}
```

Claims are **cache hints** for UX and coarse checks.  
**Source of truth** for membership remains Firestore `tenantMemberships`.

Claims are refreshed on:

- Invite accept
- Role change
- Membership revoke
- Tenant create

### Session Strategy

| Client | Mechanism |
|--------|-----------|
| Web SPA | Firebase Auth persistence (IndexedDB) |
| API | Stateless Bearer verification each request |
| Public booking | Unauthenticated or customer OTP (later) |

No long-lived custom JWTs issued by Express for v1.

---

## Authorization (What can you do?)

### Model: RBAC + Permissions (HubSpot / Salesforce style)

#### Roles

| Role | Intent |
|------|--------|
| `owner` | Full control + billing |
| `admin` | Full ops except billing transfer |
| `manager` | Team + customers + bookings |
| `staff` | Assigned records only |
| `readonly` | View-only |

#### Permissions (examples)

```
customers:read
customers:write
customers:delete
appointments:read
appointments:write
inbox:read
inbox:reply
ai:use
whatsapp:send
invoices:read
invoices:write
invoices:export
settings:manage
billing:manage
staff:manage
reports:view
```

Role → permission matrix lives in `packages/shared/src/constants/permissions.ts`.

### Enforcement Layers

| Layer | Responsibility |
|-------|----------------|
| Firestore Rules | Defense-in-depth for direct client access |
| API `authorize` middleware | Primary enforcement |
| Service-level checks | Record ownership (staff scoping) |
| UI `usePermissions` | Hide/disable controls only |

**Never rely on UI alone.**

### Middleware Contract

```ts
authorize("customers:write")
authorizeAny(["invoices:write", "billing:manage"])
authorizeRole(["owner", "admin"])
```

### Staff Record Scoping

For `staff` role:

- Appointments: only `assignedStaffId === uid`
- Inbox: only assigned conversations
- Customers: only if linked to assigned work (configurable per tenant)

---

## Platform Superadmin

Separate from tenant roles:

- `platformRole: superadmin`
- Access via internal admin console (future `apps/admin`)
- Can impersonate tenant **only with audit log**
- Never mixed into tenant owner permissions

---

## Invite Flow

1. Owner/admin creates invite (`tenantInvites`)
2. Email / WhatsApp link with token
3. User signs up / signs in
4. Membership created; claims refreshed
5. Invite marked accepted

---

## Security Invariants

1. User without membership cannot access tenant data
2. Suspended tenant → all API calls return `TENANT_SUSPENDED`
3. Deleted membership → immediate access loss (token may be old; membership check always runs)
4. Cross-tenant IDOR prevented by repository `tenantId` binding
5. Webhook endpoints use signature verification, not user auth
