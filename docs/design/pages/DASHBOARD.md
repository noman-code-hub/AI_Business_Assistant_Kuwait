# Home Dashboard

**Route:** `/app/dashboard`  
**Layout:** Dashboard Layout

---

## Purpose

At-a-glance operational command center: KPIs, today’s schedule, AI/WhatsApp activity, sales funnel snapshot, and quick actions — HubSpot home + Stripe metrics hybrid.

---

## Layout

```
Page header (greeting + date + Quick actions)
KPI metric row (4 cards)
Main grid 8/4:
  Left: Revenue chart · Appointments today table
  Right: AI inbox peek · Tasks / follow-ups
Bottom: Leads pipeline mini · Recent customers
```

---

## Sections

1. **Greeting header** — “Good morning, {Name}” + Kuwait date  
2. **KPI row** — Customers · Appointments today · Open leads · Revenue (MTD KWD)  
3. **Revenue / activity chart** — 30-day area chart  
4. **Today’s appointments** — compact table  
5. **AI & WhatsApp peek** — unread conversations list  
6. **Follow-ups** — checklist / tasks  
7. **Pipeline snapshot** — donut or horizontal stages  
8. **Recent customers** — avatar list  

---

## Cards

| Card | Content |
|------|---------|
| MetricCard ×4 | Value, delta %, sparkline |
| ChartCard | Area chart + range tabs (7D/30D/90D) |
| ListCard | Appointments / AI threads |
| PipelineCard | Stage counts |

---

## Tables

- Today’s appointments: Time · Customer · Service · Staff · Status · Actions  
- Mobile: stacked cards  

---

## Forms / Filters

- Date range on chart  
- Location filter (multi-branch) in header  

---

## Actions & Buttons

| Button | Placement |
|--------|-----------|
| New Appointment | Header primary |
| Add Customer | Header secondary |
| Ask AI | Accent button |
| View all | Card footers |

Row actions: Confirm · Reschedule · Message  

---

## Empty State

First-run checklist card:

1. Complete business profile  
2. Connect WhatsApp  
3. Add first customer  
4. Create first appointment  

---

## Loading State

`DashboardSkeleton`: 4 metric skeletons → chart block → 2 list skeletons  

---

## Responsive

| Viewport | Behavior |
|----------|----------|
| **Desktop** | 12-col grid; KPIs in 4 columns; 8/4 split |
| **Tablet** | KPIs 2×2; stacks to single column below |
| **Mobile** | Vertical stack; chart full bleed; hide secondary deltas under “Details” |
