# Navigation Architecture

Comparable to HubSpot / Salesforce / GHL: grouped, scannable, role-aware.

---

## Sidebar Structure

### Brand Block

- Logo mark + wordmark “ABA Kuwait”
- Collapse chevron
- Tenant name (truncated) under logo

### Nav Groups

#### Main

| Item | Route | Icon (Lucide) | Badge |
|------|-------|---------------|-------|
| Dashboard | `/app/dashboard` | `LayoutDashboard` | — |
| Customers | `/app/customers` | `Users` | — |
| AI Chats | `/app/ai` | `Bot` | Unread AI |
| Appointments | `/app/appointments` | `CalendarCheck` | Today count |
| Calendar | `/app/calendar` | `Calendar` | — |
| Leads | `/app/leads` | `Filter` | New leads |
| Quotations | `/app/quotations` | `FileText` | Drafts |
| Invoices | `/app/invoices` | `Receipt` | Overdue |
| Notifications | `/app/notifications` | `Bell` | Unread |
| Reports | `/app/reports` | `BarChart3` | — |

#### Workspace

| Item | Route | Icon |
|------|-------|------|
| Settings | `/app/settings` | `Settings` |
| Profile | `/app/profile` | `UserRound` |
| Admin | `/app/admin` | `Shield` |
| Help Center | `/app/help` | `CircleHelp` |

**Admin** visible only if `platformRole === superadmin` **or** tenant `owner/admin` for business-admin subset. Platform analytics/logs = superadmin only.

### Footer (Sidebar)

- Plan chip: `Trial` / `Pro` / `Business`
- Storage / AI usage mini meter (optional)
- Collapse control

---

## Navbar (Top)

| Zone | Content |
|------|---------|
| Left | Mobile menu · Breadcrumb (desktop) |
| Center | Global Search (`⌘K` / `Ctrl+K`) — customers, leads, invoices, pages |
| Right | Locale · Theme · Notifications · Tenant switcher · Avatar menu |

### Avatar Menu

- Profile  
- Business profile  
- Billing  
- Theme  
- Sign out  

---

## Breadcrumb Pattern

```
Workspace / Customers / Fatima Al-Ahmad
```

- Last crumb non-clickable  
- RTL reverses visually via logical flex  

---

## Mobile Navigation

**Bottom bar (5 slots):**

1. Dashboard  
2. Customers  
3. AI Chats  
4. Appointments  
5. More (sheet with remaining items)

---

## Active States

- Active item: primary tint background + primary left bar (4px) in LTR; right bar in RTL  
- Hover: muted sidebar hover  
- Nested settings: secondary nav active underline / bg  

---

## Command Palette (Global Search)

Groups:

- Actions (Create customer, Create invoice…)  
- Records (recent customers/leads)  
- Navigation (jump to page)  
- AI (Ask assistant…)  

Keyboard: `⌘K`, arrows, Enter, Esc.
