# Layouts

All authenticated product chrome shares one visual language. Layouts are shells only — pages fill the content slot.

---

## Shared Chrome Tokens

| Element | Spec |
|---------|------|
| Top navbar height | `64px` |
| Sidebar width | `264px` / collapsed `72px` |
| Content padding | `32 / 24 / 16` |
| Content max | `1440px` |
| Z-index | Sidebar `40`, Navbar `50`, Drawer `60`, Modal `70`, Toast `80` |

---

## 1. Authentication Layout

**Route group:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`

### Structure

```
┌──────────────────────────────────────────────┐
│  [Brand]                         [Lang][Theme]│
├────────────────────┬─────────────────────────┤
│                    │                         │
│  Marketing panel   │   Auth card (centered)  │
│  (glass / image)   │   Logo + title + form   │
│  Kuwait value prop │   Footer links          │
│                    │                         │
└────────────────────┴─────────────────────────┘
```

### Sections

1. **Top bar** — Logo, locale switcher (EN/AR), theme toggle  
2. **Left panel (desktop)** — Gradient/glass brand story, 1 headline, 1 sentence, soft product screenshot  
3. **Right panel** — Auth card (`max-w-md`)  
4. **Footer** — Terms · Privacy · Help  

### Responsive

| Viewport | Behavior |
|----------|----------|
| Desktop | Split 45/55 |
| Tablet | Stack; brand panel collapses to slim banner |
| Mobile | Form only; brand logo above card |

### States

- Loading: button spinner, inputs disabled  
- Error: inline alert above form  
- Empty: N/A  

---

## 2. Dashboard Layout (Primary App Shell)

**Route group:** `/app/*` (all business pages)

### Structure

```
┌────────┬─────────────────────────────────────┐
│        │  Navbar: search · tenant · notif ·  │
│ Side   │         avatar · theme              │
│ bar    ├─────────────────────────────────────┤
│        │  Breadcrumb                         │
│  Nav   │  Page header (title + actions)      │
│        │  ┌───────────────────────────────┐  │
│        │  │  Page content                 │  │
│        │  └───────────────────────────────┘  │
└────────┴─────────────────────────────────────┘
```

### Regions

| Region | Contents |
|--------|----------|
| Sidebar | Logo, nav groups, collapse control, plan badge |
| Navbar | Global search (⌘K), tenant switcher, notifications bell, help, avatar menu |
| Breadcrumb | Auto from route meta |
| Page header | Title, description, primary/secondary actions |
| Content | Page-specific |
| Optional right drawer | Filters / AI / details |

### Responsive

| Viewport | Behavior |
|----------|----------|
| Desktop ≥1024 | Persistent sidebar |
| Tablet | Collapsible sidebar (overlay) |
| Mobile | Bottom nav (top 5) + hamburger for full menu; navbar compact |

---

## 3. Admin Layout

**Route group:** `/app/admin/*`

Extends Dashboard Layout with:

- **Admin accent bar** (thin teal strip under navbar)
- **Admin-only sidebar section** pinned at bottom or separate admin nav group
- **Environment badge** (Production / Staging)
- Stricter empty permission gate → Error Layout 403

### Sections

1. Platform header (“Platform Admin”)  
2. Admin subnav: Businesses · Analytics · Logs  
3. Content  

---

## 4. Settings Layout

**Route group:** `/app/settings/*`

### Structure

```
┌────────┬──────────────┬──────────────────────┐
│ App    │ Settings     │  Settings content    │
│ Side   │ secondary    │  (forms / cards)     │
│ bar    │ nav          │                      │
└────────┴──────────────┴──────────────────────┘
```

### Specs

- Secondary settings nav width: `220px`
- Sticky section titles
- Save bar: sticky bottom glass bar with Discard / Save (dirty-state only)

### Responsive

| Viewport | Behavior |
|----------|----------|
| Desktop | Dual nav |
| Tablet/Mobile | Settings nav becomes horizontal scroll tabs or accordion list page → detail |

---

## 5. Empty State Layout

**Usage:** Any list/detail with zero data

### Structure (centered in content)

```
[Illustration 120–160px]
Title (h2)
Supporting sentence
[Primary CTA]  [Secondary link]
```

### Variants

| Variant | Example CTA |
|---------|-------------|
| First-run | “Add your first customer” |
| Filtered empty | “Clear filters” |
| No permission | “Request access” |
| Integration off | “Connect WhatsApp” |

---

## 6. Error Layout

**Routes / gates:** `/unauthorized`, `/404`, `/500`, tenant suspended

### Structure

```
Centered card
  Status code / icon
  Title
  Message
  [Go Home] [Contact Support] [Retry]
  Request ID (caption, copyable)
```

### Variants

- `403` Forbidden  
- `404` Not found  
- `500` Server error  
- `Tenant suspended`  

---

## 7. Loading Layout

### Full-page

- App shell chrome visible (sidebar + navbar skeletons)
- Content: **page skeleton** matching target layout (metrics row → charts → table)

### Inline

- Button: spinner + “Saving…”  
- Table: 8 skeleton rows  
- Cards: shimmer blocks  

### Route transition

- Top progress bar (Linear-style, 2px primary) optional  
- Prefer skeletons over spinners for pages  

---

## Layout Composition Map

| Layout | Used by |
|--------|---------|
| Auth | Login, Register, Forgot, Reset, Verify |
| Dashboard | CRM, AI, Appointments, Leads, Quotes, Invoices, Reports, Notifications, Profile, Help |
| Settings | All settings pages |
| Admin | Business management, Platform analytics, Logs |
| Empty | Embedded inside pages |
| Error | Standalone + embedded gates |
| Loading | Route suspense / query pending |
