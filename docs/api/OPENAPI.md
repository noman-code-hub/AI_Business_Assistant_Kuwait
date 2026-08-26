# OpenAPI Contract (Placeholder)

Base URL: `/api/v1`

Authentication: `Bearer <Firebase ID Token>`  
Tenancy: `X-Tenant-Id: <tenantId>`

## Envelope

Success and error envelopes are defined in `API_ARCHITECTURE.md`.

## Resource Groups (Planned)

- Auth
- Tenants
- Users / Memberships
- Customers
- Appointments / Bookings
- Inbox / WhatsApp
- AI Assistant
- Calendar
- Invoices / PDF
- Inventory / Catalog
- Staff / Services
- Vertical resources (properties, vehicles, events, memberships, menu)
- Reports
- Billing
- Storage
- Webhooks

Detailed path schemas will be generated from Zod during implementation phase.
