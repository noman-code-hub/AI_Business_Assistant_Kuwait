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
 → API client attaches Authorization: Bearer <token>
 → API middleware verifies token via Firebase Admin
 → attaches res.locals.user = { uid, email, emailVerified }
```

### Custom Claims (lightweight)

Claims may be used later as UX hints. **Source of truth** for membership remains Firestore `tenantMemberships`.

---

## Authorization (What can you do?) — Phase 4 RBAC

See also: [PHASE4_ROLES_PERMISSIONS.md](./PHASE4_ROLES_PERMISSIONS.md)

### Model

```
authenticate → resolveTenant (ACTIVE membership) → requirePermission → controller
```

Roles (on `BusinessMember` / `tenantMemberships`):

`owner` | `admin` | `manager` | `staff` | `receptionist` | `accountant` | `viewer`

Permissions live in `packages/shared/src/constants/permissions.ts` (`resource.action`).

### Enforcement Layers

| Layer | Responsibility |
|-------|----------------|
| Firestore Rules | Defense-in-depth; membership role/status not client-writable |
| API `requirePermission` | Primary enforcement |
| Service-level checks | Last-owner, cross-tenant membership targets |
| UI `usePermissions` / `can()` | Hide/disable controls only |

**Never rely on UI alone.**

### Middleware Contract

```ts
requirePermission(PERMISSIONS.CUSTOMERS_CREATE)
requireAnyPermission([PERMISSIONS.SETTINGS_READ, PERMISSIONS.SETTINGS_MANAGE])
authorizeRole([Role.OWNER, Role.ADMIN]) // coarse; prefer permissions
```

### Errors

- `PERMISSION_DENIED` (403)
- `TENANT_ACCESS_DENIED` (403)
- `LAST_OWNER_REQUIRED` (403)
- `TENANT_SUSPENDED` (403)

---

## Platform Superadmin

Separate from tenant roles (future `apps/admin`). Never mixed into tenant owner permissions.

---

## Invite Flow

Planned for a later phase. Membership statuses already include `invited`.

---

## Security Invariants

1. User without ACTIVE membership cannot access tenant data
2. Suspended tenant → `TENANT_SUSPENDED`
3. Client cannot forge `role` or `permissions`
4. OWNER assignment is not available via generic role-update API
5. Last active OWNER cannot be demoted/removed
