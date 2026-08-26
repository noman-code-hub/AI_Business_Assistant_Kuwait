# CRM — Customers

**Layout:** Dashboard Layout

---

## Customer List — `/app/customers`

| Field | Spec |
|-------|------|
| **Purpose** | Search, filter, and manage all customers |
| **Layout** | List page shell |
| **Sections** | Header; Filter bar; Data table; Bulk bar; Pagination |
| **Cards** | Mobile: customer cards instead of table |
| **Tables** | Name · Phone · Email · Tags · Source · Last activity · Status · ⋯ |
| **Forms** | — (inline quick-add optional drawer) |
| **Filters** | Search; Status; Tag; Source; Date range; Staff owner |
| **Actions** | Export CSV; Import; Bulk tag; Bulk message |
| **Buttons** | Primary “Add customer”; Secondary “Import” |
| **Empty State** | Illustration + “Add your first customer” |
| **Loading State** | Table skeleton 8 rows |
| **Desktop** | Full table + sticky toolbar |
| **Tablet** | Fewer columns (hide email/source) |
| **Mobile** | Card list + FAB “Add” |

---

## Customer Details — `/app/customers/:id`

| Field | Spec |
|-------|------|
| **Purpose** | 360° customer profile |
| **Layout** | Detail shell: header + tabs + main/sidebar |
| **Sections** | Profile header (avatar, name, phone, status); Tabs: Overview · Appointments · Conversations · Invoices · Files · Activity; Right: quick facts + AI summary |
| **Cards** | Contact card; Stats (LTV, visits); AI insights card |
| **Tables** | Nested appointments & invoices tables |
| **Forms** | Quick note composer |
| **Filters** | Tab-local date filters |
| **Actions** | Book · Message WhatsApp · Create quote · Edit · Archive |
| **Buttons** | Primary “Book appointment”; Accent “Message”; Destructive in menu |
| **Empty State** | Per-tab empties (“No invoices yet”) |
| **Loading State** | Header skeleton + tab skeleton |
| **Desktop** | 8/4 split |
| **Tablet** | Sidebar stacks below |
| **Mobile** | Tabs scroll; actions in bottom sheet |

---

## Add Customer — `/app/customers/new`

| Field | Spec |
|-------|------|
| **Purpose** | Create customer record |
| **Layout** | Form page + sticky save bar |
| **Sections** | Basic info; Contact; Preferences; Tags; Notes |
| **Cards** | One or two form cards |
| **Forms** | Full name, name AR, phone (+965), email, gender, DOB, tags, source, notes, marketing consent |
| **Filters** | — |
| **Actions** | Save; Save & book; Cancel |
| **Buttons** | Primary “Save customer”; Secondary “Save & book” |
| **Empty / Loading** | Submit loading; validation errors inline |
| **Desktop** | Centered `max-w-3xl` form |
| **Tablet/Mobile** | Full width; sections as accordions optional |

---

## Edit Customer — `/app/customers/:id/edit`

Same as Add Customer with:

- Prefilled fields  
- Danger zone card: Archive / Delete (permission-gated)  
- Dirty-state sticky save bar  
- Loading: form skeleton then hydrate  
