# Phase 5 — Main Dashboard

## Overview

The operational dashboard at `/app/dashboard` uses **real tenant-scoped API data** — no dummy presentation data.

## Architecture

```
Frontend (useDashboard + tenantId cache key)
  → GET /api/v1/dashboard/summary
  → GET /api/v1/dashboard/revenue?range=
  → DashboardService (trusted tenantId from middleware)
  → Repositories (tenant path + tenantId field)
  → Firestore
```

## API

| Endpoint | Permission | Description |
|----------|------------|-------------|
| `GET /dashboard/summary` | `dashboard.read` | Summary cards, today's appointments, recent activity |
| `GET /dashboard/revenue?range=` | `payments.read` | Revenue chart (`today`, `7d`, `30d`, `12m`) |

## Metrics

| Metric | Source | Definition |
|--------|--------|------------|
| Revenue (today card) | `payments` | Sum of **completed** payments with `paidAt` today (business timezone) |
| Customers | `customers` | Count of non-deleted customers |
| Appointments today | `appointments` | Count in today's bounds (`startsAt`) |
| Invoices | `invoices` | Count of non-deleted invoices |
| Pending payments | `invoices` + `payments` | Outstanding balance on `sent`/`overdue` invoices minus completed payments |
| Recent activity | `auditLogs` | Latest tenant audit entries |

## Revenue chart

- **Recognized revenue** = completed payments only (not unpaid invoices).
- Refunds (`refunded` status) are excluded.
- Buckets use the **business timezone** from the tenant record.

## Permissions

- Base dashboard: `dashboard.read`
- Revenue + pending payments: `payments.read` (backend omits financial fields if missing)
- Sections respect Phase 4 `can()` on the frontend (UX only)

## Business switching

`useDashboard` depends on `tenantId` — switching businesses clears stale data and refetches.

## Indexes

`payments`: `tenantId + status + paidAt` (see `firebase/firestore.indexes.json`).

## Known limitations

- AI conversation activity appears when the AI/messaging feature ships.
- Very large tenants may need aggregation jobs for counts (current implementation uses lightweight selects).
