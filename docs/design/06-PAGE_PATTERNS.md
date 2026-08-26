# Shared Page Patterns

Reusable UX patterns every page must follow.

---

## 1. List Page

```
Header (title, description, primary/secondary actions)
Filter bar (search + chips + advanced filters drawer)
Bulk action bar (appears when rows selected)
DataTable / CardList
Pagination footer
```

**Empty:** centered Empty State Layout  
**Loading:** table skeleton  
**Error:** inline alert + Retry  

---

## 2. Detail Page

```
Back link + Breadcrumb
Entity header (avatar/title/status/actions)
Tabs
Main (2/3) + Context sidebar (1/3)
```

---

## 3. Form Page

```
Header
Form sections as cards
Sticky save bar (Discard / Save) when dirty
```

---

## 4. Split Preview (Quotes / Invoices)

```
Desktop: Editor | PDF Preview
Tablet/Mobile: Tabs Edit / Preview
```

---

## 5. Inbox Triple Pane

```
Desktop: Queues | Thread | Context
Tablet: Queues | Thread ; Context = Drawer
Mobile: Stacked full screens
```

---

## 6. Report Page

```
Header + date range + export
KPI row
Charts
Breakdown table
```

---

## Button Hierarchy Rules

1. One **Primary** per page header  
2. **Secondary** for alternatives  
3. **Accent** only for AI / WhatsApp highlight actions  
4. **Destructive** never in primary header — use overflow menu  

---

## Status Chip Mapping

Use `AbaStatusChip` exclusively for entity statuses — never raw colored text.

---

## Responsive Checklist (every page)

- [ ] Desktop ≥1024 works with sidebar  
- [ ] Tablet collapses columns / uses drawers  
- [ ] Mobile: no horizontal scroll (except kanban/calendar intentionally)  
- [ ] Touch targets ≥ 44px  
- [ ] RTL mirrored tested for nav and forms  
