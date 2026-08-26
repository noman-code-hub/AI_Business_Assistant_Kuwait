# Notifications & Reports

**Layout:** Dashboard Layout

---

## Notification Center — `/app/notifications`

| Field | Spec |
|-------|------|
| **Purpose** | Unified alerts across CRM, AI, billing, system |
| **Layout** | List with filter chips |
| **Sections** | Header (Mark all read); Filter chips; Notification list; Detail drawer |
| **Cards** | Notification rows as list cards |
| **Tables** | — |
| **Forms** | — |
| **Filters** | All · Unread · Appointments · AI · Billing · System |
| **Actions** | Mark read; Open target entity; Dismiss |
| **Buttons** | Ghost “Mark all as read” |
| **Empty State** | “You’re all caught up” |
| **Loading State** | List skeletons |
| **Desktop** | List + optional preview pane |
| **Tablet/Mobile** | Full list; tap opens target route |

**Row anatomy:** Icon · Title · Body · Relative time · Unread dot · Entity badge  

---

## Reports Hub Pattern

All report pages share:

- Header + date range picker + export  
- KPI row  
- Chart(s)  
- Breakdown table  
- Empty: “Not enough data in this range”  
- Loading: chart + table skeletons  

---

## Sales Reports — `/app/reports/sales`

| Field | Spec |
|-------|------|
| **Purpose** | Revenue, quotes, conversion |
| **Sections** | KPIs (Revenue, Avg ticket, Win rate); Revenue chart; By service/staff tables; Quote conversion funnel |
| **Cards** | Metric ×4; Funnel card |
| **Tables** | Top services; Top staff; Recent paid invoices |
| **Filters** | Date range; Location; Staff; Vertical |
| **Actions** | Export CSV/PDF |
| **Buttons** | Secondary “Export” |
| **Responsive** | Charts full width on mobile; tables → cards |

---

## Appointment Reports — `/app/reports/appointments`

| Field | Spec |
|-------|------|
| **Purpose** | Utilization, no-shows, peaks |
| **Sections** | KPIs (Booked, Completed, No-show rate); Heatmap/bar by day/hour; Staff utilization table |
| **Cards** | Metric + chart cards |
| **Tables** | Staff performance |
| **Filters** | Date; Staff; Service; Status |
| **Actions** | Export |
| **Empty / Loading** | Shared report pattern |
| **Responsive** | Heatmap simplifies to bar on mobile |

---

## Customer Reports — `/app/reports/customers`

| Field | Spec |
|-------|------|
| **Purpose** | Growth, retention, sources |
| **Sections** | New vs returning; Source breakdown donut; Cohort/retention simple table; Top customers by LTV |
| **Cards** | Metric + donut |
| **Tables** | Customers by source; LTV leaders |
| **Filters** | Date; Source; Tags |
| **Actions** | Export |
| **Responsive** | Standard |

---

## AI Analytics — `/app/reports/ai`

| Field | Spec |
|-------|------|
| **Purpose** | AI usage, automation ROI, inbox deflection |
| **Sections** | KPIs (Conversations, Tokens, Automation rate, Avg response); Usage chart; Top intents; Guardrail blocks; Cost estimate card |
| **Cards** | Accent-styled metric cards |
| **Tables** | Intent breakdown; Failed tool runs |
| **Filters** | Date; Channel (WhatsApp/AI chat) |
| **Actions** | Export; Link to Knowledge Base gaps |
| **Buttons** | Accent “Improve knowledge base” |
| **Empty State** | “Connect AI / WhatsApp to see analytics” |
| **Loading State** | Dashboard-like skeleton |
| **Desktop** | 8/4 charts |
| **Mobile** | Stack; hide cost footnotes in accordion |
