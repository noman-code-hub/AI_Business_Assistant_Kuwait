# Sales — Leads, Quotations, Invoices

**Layout:** Dashboard Layout

---

## Lead List — `/app/leads`

| Field | Spec |
|-------|------|
| **Purpose** | Track inbound/outbound prospects |
| **Layout** | List shell + link to Pipeline view |
| **Sections** | Header; Filters; Table; Pagination |
| **Cards** | Mobile lead cards |
| **Tables** | Name · Phone · Source · Stage · Owner · Score · Updated · ⋯ |
| **Forms** | Quick-add drawer |
| **Filters** | Stage; Source; Owner; Score range; Date |
| **Actions** | Assign; Change stage; Convert to customer; WhatsApp |
| **Buttons** | Primary “Add lead”; Secondary “Pipeline view” |
| **Empty State** | “Capture your first lead” |
| **Loading State** | Table skeleton |
| **Desktop** | Full table |
| **Tablet** | Hide score |
| **Mobile** | Cards + stage chips |

---

## Pipeline — `/app/leads/pipeline`

| Field | Spec |
|-------|------|
| **Purpose** | Kanban pipeline (HubSpot deals style) |
| **Layout** | Horizontal board under header |
| **Sections** | Stages as columns; Lead cards; Column totals |
| **Cards** | Lead cards: name, value KWD, owner avatar, age |
| **Tables** | — |
| **Forms** | Card quick-edit popover |
| **Filters** | Owner; Source; Value range |
| **Actions** | Drag between stages; Click → details |
| **Buttons** | Add lead per column |
| **Empty State** | Empty column placeholder |
| **Loading State** | Column skeletons |
| **Desktop** | Horizontal scroll columns |
| **Tablet** | Fewer visible columns, swipe |
| **Mobile** | Stage dropdown + vertical card stack |

---

## Lead Details — `/app/leads/:id`

| Field | Spec |
|-------|------|
| **Purpose** | Qualify and convert lead |
| **Layout** | Detail shell |
| **Sections** | Header (stage selector); Tabs Overview · Activity · Conversations · Tasks; Sidebar: score, owner, value |
| **Cards** | AI qualification card; Next best action |
| **Tables** | Activity timeline (component) |
| **Forms** | Note; Task; Stage change |
| **Filters** | — |
| **Actions** | Convert; Disqualify; Book meeting; Send quote |
| **Buttons** | Primary “Convert to customer”; Accent “AI summarize” |
| **Empty State** | No activity yet |
| **Loading State** | Detail skeleton |
| **Responsive** | Same as Customer Details pattern |

---

## Quotation List — `/app/quotations`

| Field | Spec |
|-------|------|
| **Purpose** | Manage quotes |
| **Layout** | List shell |
| **Sections** | Header; Filters; Table |
| **Tables** | Number · Customer · Amount (KWD) · Status · Valid until · Owner · ⋯ |
| **Filters** | Status; Date; Customer search |
| **Actions** | Duplicate; Send; Convert to invoice; PDF |
| **Buttons** | Primary “Create quotation” |
| **Empty State** | “Create your first quotation” |
| **Loading State** | Table skeleton |
| **Responsive** | Standard list pattern |

---

## Create Quotation — `/app/quotations/new`

| Field | Spec |
|-------|------|
| **Purpose** | Build line-item quotation |
| **Layout** | Form + live PDF preview (desktop) |
| **Sections** | Customer; Line items editor; Taxes/discount; Notes EN/AR; Validity; Preview |
| **Cards** | Totals card |
| **Tables** | Line items editable table |
| **Forms** | Full quote form |
| **Actions** | Save draft; Send; Preview PDF |
| **Buttons** | Primary “Save draft”; Secondary “Preview”; Accent “Send via WhatsApp” |
| **Empty State** | Empty line items row prompt |
| **Loading State** | Form skeleton |
| **Desktop** | Split form / PDF preview |
| **Tablet** | Tabs: Edit | Preview |
| **Mobile** | Edit first; Preview sheet |

---

## Preview PDF (Quote) — `/app/quotations/:id/preview`

| Field | Spec |
|-------|------|
| **Purpose** | Review branded PDF before send |
| **Layout** | PDF preview chrome |
| **Sections** | Toolbar; PDF canvas; Side metadata |
| **Cards** | Send options card |
| **Actions** | Download; Print; Send email/WhatsApp; Edit |
| **Buttons** | Primary “Send”; Secondary “Download” |
| **Loading State** | PDF skeleton shimmer |
| **Responsive** | Full-screen preview on mobile |

---

## Invoice List — `/app/invoices`

| Field | Spec |
|-------|------|
| **Purpose** | Accounts receivable list |
| **Layout** | List shell |
| **Sections** | KPI strip (Paid / Outstanding / Overdue); Filters; Table |
| **Cards** | 3 metric cards above table |
| **Tables** | Number · Customer · Issued · Due · Amount · Status · ⋯ |
| **Filters** | Status; Date; Overdue only |
| **Actions** | Record payment; Send reminder; Void |
| **Buttons** | Primary “Create invoice” |
| **Empty State** | “No invoices yet” |
| **Loading State** | Metrics + table skeletons |
| **Responsive** | Standard list |

---

## Create Invoice — `/app/invoices/new`

Mirrors Create Quotation with:

- Invoice number / issue & due dates  
- Payment terms  
- Optional convert-from-quotation banner  
- Primary “Issue invoice”  

---

## Receipt — `/app/invoices/:id/receipt`

| Field | Spec |
|-------|------|
| **Purpose** | Payment receipt view/print |
| **Layout** | Centered receipt card + PDF actions |
| **Sections** | Business header; Customer; Line summary; Amount paid; Payment method; Footer stamp |
| **Cards** | Receipt surface (print-friendly) |
| **Actions** | Download PDF; WhatsApp receipt; Print |
| **Buttons** | Primary “Download”; Secondary “Share” |
| **Empty State** | Unpaid invoice → CTA “Record payment” |
| **Loading State** | Receipt skeleton |
| **Desktop** | Centered `max-w-2xl` |
| **Mobile** | Full width; sticky share bar |
