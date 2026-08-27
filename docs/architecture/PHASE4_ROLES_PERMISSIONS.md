# Phase 4 — Roles & Permissions (RBAC)

## Status

Implemented on top of Phase 3 multi-tenancy. Backend is the security boundary; frontend checks are UX only.

## Authorization flow

```
User
 → Authentication (Firebase ID token)
 → Business Membership (tenantMemberships, ACTIVE only)
 → tenantId (X-Tenant-Id + membership proof)
 → Role (from membership — never from client body/headers)
 → Permissions (ROLE_PERMISSIONS / OWNER via hasPermission)
 → Allow / Deny
```

Tenant isolation always runs first. A user who is ADMIN on Business A still gets `TENANT_ACCESS_DENIED` for Business B.

## Roles

| Role | Purpose |
|------|---------|
| `owner` | Full control of the business (all registered permissions) |
| `admin` | Most operations + team/settings; not `subscription.manage` |
| `manager` | Day-to-day ops (customers, appointments, catalog, limited team) |
| `staff` | Operational create/update for customers & appointments |
| `receptionist` | Customer + appointment focused (incl. cancel) |
| `accountant` | Invoices, payments, reports |
| `viewer` | Read-only |

Legacy membership role `readonly` is normalized to `viewer`.

## Permissions

Central registry: `packages/shared/src/constants/permissions.ts`

Naming: `resource.action` (e.g. `customers.create`, `team.manage`).

## Role → permission mapping

- **OWNER**: every permission in `PERMISSIONS` via centralized `hasPermission` (do not scatter `if (role === OWNER)`).
- **ADMIN / MANAGER / STAFF / RECEPTIONIST / ACCOUNTANT / VIEWER**: explicit lists in `ROLE_PERMISSIONS`.

## Membership status

| Status | API access |
|--------|------------|
| `active` | Yes (if role valid) |
| `invited` | No |
| `suspended` | No |
| `removed` | No |
| `disabled` (legacy) | No |

## Backend

Pipeline for tenant-scoped routes:

```ts
authenticate → resolveTenant → requirePermission(PERMISSIONS.X) → controller
```

Context on `res.locals`:

- `user` (uid)
- `tenantId`
- `membershipId`
- `role` (trusted)

Key files:

- `apps/api/src/middleware/resolve-tenant.ts`
- `apps/api/src/middleware/authorize.ts` (`requirePermission`)
- `apps/api/src/modules/memberships/*`

### Membership APIs

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/memberships` | `team.read` |
| PATCH | `/api/v1/memberships/:userId/role` | `team.update` |
| PATCH | `/api/v1/memberships/:userId/status` | `team.remove` |

Role-change rules:

- Cannot assign `owner` via API body
- Cannot change your own role
- Cannot demote/suspend/remove the last active owner → `LAST_OWNER_REQUIRED`
- Cross-tenant target → `TENANT_ACCESS_DENIED`
- Client `permissions` arrays are ignored

### Errors

| Code | HTTP |
|------|------|
| `PERMISSION_DENIED` | 403 |
| `TENANT_ACCESS_DENIED` | 403 |
| `LAST_OWNER_REQUIRED` | 403 |

## Frontend (UX only)

- `PermissionsProvider` + `usePermissions()` / `can(permission)`
- Rebuilds on business switch (`tenantId` + `membershipRole`)
- `RequirePermission` route wrapper
- Sidebar / action buttons hide when `can(...)` is false

## Firestore rules

`tenantMemberships` create/update/delete are **false** for clients (Admin SDK / API only). Prevents forging `role` / `status` from the browser.

## Adding a permission (future phases)

1. Add to `PERMISSIONS` in `permissions.ts`
2. Grant in `ROLE_PERMISSIONS` (OWNER auto-includes all)
3. Guard the route with `requirePermission(PERMISSIONS.X)`
4. Optionally gate UI with `can(PERMISSIONS.X)`
5. Add matrix unit tests

## What Phase 4 does not include

- Full invite/accept UI
- Ownership transfer wizard
- Fine-grained staff record scoping (`assignedStaffId`)
- Live invoice/appointment APIs (stubs remain; permissions ready)
