# Design Index — AI Business Assistant Kuwait UI

## Documents

| # | Doc | Contents |
|---|-----|----------|
| 01 | [Design System](./01-DESIGN_SYSTEM.md) | Colors, type, spacing, motion, a11y, RTL |
| 02 | [Layouts](./02-LAYOUTS.md) | Auth, Dashboard, Admin, Settings, Empty, Error, Loading |
| 03 | [Navigation](./03-NAVIGATION.md) | Sidebar, navbar, mobile, command palette |
| 04 | [Components](./04-COMPONENTS.md) | All reusable UI primitives |
| 05 | [Page Map](./05-PAGE_MAP.md) | Routes + layout assignment |
| — | [Auth Pages](./pages/AUTH.md) | Login → Verify Email |
| — | [Dashboard](./pages/DASHBOARD.md) | Home dashboard |
| — | [CRM](./pages/CRM.md) | Customers |
| — | [Appointments](./pages/APPOINTMENTS.md) | Calendar & booking |
| — | [AI](./pages/AI.md) | AI chats, WhatsApp, KB, FAQ |
| — | [Sales](./pages/SALES.md) | Leads, Quotations, Invoices |
| — | [Notifications & Reports](./pages/INSIGHTS.md) | Notifications + reports |
| — | [Settings & Profile](./pages/SETTINGS.md) | Settings + profile |
| — | [Admin & Help](./pages/ADMIN_HELP.md) | Admin + Help Center |

## Token Source Files

- `apps/web/src/styles/tokens.css`
- `apps/web/src/styles/themes.css`
- `apps/web/src/design-system/`

## Implementation Note

This phase defines **UI structure and design only**. No backend wiring. Pages should be scaffolded against these specs using Shadcn + the token system.
