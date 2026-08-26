# Reusable Components Catalog

Foundation: **Shadcn UI**. All ABA components are thin wrappers with design tokens.

---

## 1. Buttons — `AbaButton`

| Variant | Style | Use |
|---------|-------|-----|
| `primary` | `#2563EB` fill | Main CTA |
| `secondary` | Outline / secondary fill | Secondary |
| `accent` | `#14B8A6` fill | AI / highlight |
| `ghost` | Transparent | Tertiary |
| `destructive` | `#EF4444` | Delete |
| `link` | Text link | Inline |

**Sizes:** `sm` (32) · `md` (40) · `lg` (48)  
**States:** default · hover · focus · loading (spinner) · disabled  
**Rules:** One primary per header; icon+label preferred.

---

## 2. Cards — `AbaCard`

| Variant | Use |
|---------|-----|
| `default` | Standard content |
| `metric` | KPI with trend |
| `interactive` | Hover lift, clickable |
| `glass` | Auth / overlays |
| `danger` | Destructive zones |

Anatomy: Header (title + actions) · Body · Footer  
Padding: `24px` desktop / `16px` mobile · Radius: `radius-lg` · Shadow: `shadow-sm`

---

## 3. Tables — `AbaDataTable`

Features:

- Sticky header  
- Sortable columns  
- Row selection + bulk action bar  
- Column visibility menu  
- Density toggle  
- Row click → details  
- Responsive: card-list collapse on mobile  

Anatomy: Toolbar (search/filters) · Table · Pagination footer  

---

## 4. Inputs — `AbaInput` / `AbaTextarea` / `AbaField`

- Label · optional hint · error text  
- Prefix/suffix slots (currency KWD, +965)  
- Sizes aligned to buttons  
- Invalid: danger border + message  

---

## 5. Dropdowns — `AbaSelect` / `AbaCombobox` / `AbaMenu`

- Single / multi select  
- Searchable combobox for long lists  
- Menu for row actions (`⋯`)  

---

## 6. Sidebar — `AbaSidebar`

- Expanded / collapsed  
- Group labels  
- Badge counters  
- Tenant block  
- RTL-aware  

---

## 7. Navbar — `AbaNavbar`

- Search trigger  
- Notification bell + unread dot  
- Theme + locale  
- Avatar dropdown  
- Glass sticky optional  

---

## 8. Breadcrumb — `AbaBreadcrumb`

- Route-meta driven  
- Truncate middle on mobile  

---

## 9. Search — `AbaSearch` / `AbaCommandPalette`

- Inline search (lists)  
- Global command palette (`⌘K`)  

---

## 10. Modal — `AbaModal`

Sizes: `sm` `md` `lg` `xl`  
Anatomy: Title · Description · Body · Footer actions  
Esc + overlay click (configurable) · Focus trap  

---

## 11. Drawer — `AbaDrawer`

- Right sheet (LTR) / Left (RTL)  
- Widths: `360` `480` `640`  
- Use: filters, record quick-view, AI side panel  

---

## 12. Tabs — `AbaTabs`

- Underline (settings) or pill (filters)  
- Keep-alive optional for heavy panes  

---

## 13. Accordion — `AbaAccordion`

- FAQ, Help, Settings mobile nav, Permissions groups  

---

## 14. Charts — `AbaChart`

Library: Recharts (via Shadcn chart pattern)

| Type | Use |
|------|-----|
| Area | Revenue over time |
| Bar | Appointments by day |
| Donut | Lead pipeline |
| Line | AI usage |

Theme-aware colors; empty chart state included.

---

## 15. Pagination — `AbaPagination`

- Page size: 10 / 20 / 50  
- Showing X–Y of Z  
- Compact on mobile (prev/next only)  

---

## 16. Avatar — `AbaAvatar`

- Image / initials fallback  
- Sizes: `xs`–`xl`  
- Status dot (online) optional  
- Avatar group for assignees  

---

## 17. Badges — `AbaBadge`

- `default` `primary` `accent` `success` `warning` `danger` `outline`  

---

## 18. Status Chips — `AbaStatusChip`

Mapped statuses:

Customers: Active / Inactive  
Leads: New / Contacted / Qualified / Won / Lost  
Appointments: Scheduled / Confirmed / Completed / Cancelled / No-show  
Invoices: Draft / Sent / Paid / Overdue / Void  
Quotations: Draft / Sent / Accepted / Declined / Expired  

---

## 19. Timeline — `AbaTimeline`

- Vertical activity feed (customer / lead details)  
- Icon + title + meta + relative time  
- RTL flips axis  

---

## 20. Calendar — `AbaCalendarView`

- Month / Week / Day / Agenda  
- Color by staff or status  
- Drag affordance (design only for now)  
- Today indicator primary  

---

## 21. Date Picker — `AbaDatePicker` / `AbaDateRangePicker`

- Popover + calendar  
- Presets: Today, 7d, 30d, This month  
- Kuwait timezone label in footer  

---

## 22. Toast — `AbaToast`

- Success / Error / Info / Warning  
- Action button optional (Undo)  
- Position: top-end (LTR) / top-start (RTL)  
- Stack max 3  

---

## 23. Loader — `AbaSpinner`

- `sm` `md` `lg`  
- Page-level vs button-level  

---

## 24. Skeleton — `AbaSkeleton`

Presets: `MetricRow` · `TableRows` · `Form` · `InboxList` · `ChatThread` · `Dashboard`

---

## 25. File Upload — `AbaFileUpload`

- Drag-drop zone  
- Accept list + max size  
- Progress bar  
- Preview thumbnails  
- Error: type/size  

---

## 26. PDF Preview — `AbaPdfPreview`

- Toolbar: zoom · download · print · open  
- Desktop: split pane with form  
- Mobile: full-screen sheet  

---

## Cross-Cutting Patterns

### Page Header

```
Title + description          [Secondary] [Primary]
```

### List Page Shell

```
Header → Filter bar → DataTable → Pagination
```

### Detail Page Shell

```
Header → Tabs → Main (2/3) + Sidebar (1/3)
```

### Form Page Shell

```
Header → Form card(s) → Sticky save bar
```
