# Admin & Help Center

---

## Admin — Business Management — `/app/admin/businesses`

**Layout:** Admin Layout

| Field | Spec |
|-------|------|
| **Purpose** | Platform operator manages all tenant businesses |
| **Sections** | Header; KPI strip (Total tenants, Active, Trialing, Suspended); Filters; Businesses table |
| **Cards** | Metric ×4 |
| **Tables** | Business · Vertical · Plan · Status · Users · Created · ⋯ |
| **Filters** | Status; Plan; Vertical; Search |
| **Actions** | Impersonate (audited); Suspend; View analytics; Open logs |
| **Buttons** | Secondary “Export”; Row “Manage” |
| **Empty State** | “No businesses yet” |
| **Loading State** | Metrics + table skeletons |
| **Desktop** | Full admin table density |
| **Tablet** | Hide user count |
| **Mobile** | Cards with status chips |

---

## Platform Analytics — `/app/admin/analytics`

**Layout:** Admin Layout

| Field | Spec |
|-------|------|
| **Purpose** | Cross-tenant SaaS health metrics |
| **Sections** | KPIs (MRR proxy, Signups, Active tenants, AI tokens); Growth chart; Vertical distribution; Top tenants by usage |
| **Cards** | Metric + charts |
| **Tables** | Top tenants; Churn risks |
| **Filters** | Date range; Vertical |
| **Actions** | Export |
| **Buttons** | Secondary Export |
| **Empty State** | Insufficient platform data |
| **Loading State** | Dashboard skeleton |
| **Desktop** | 12-col admin dashboard |
| **Mobile** | Stacked |

---

## Logs — `/app/admin/logs`

**Layout:** Admin Layout

| Field | Spec |
|-------|------|
| **Purpose** | Audit & system logs for support/security |
| **Sections** | Filter bar; Log stream table; Detail drawer (JSON) |
| **Cards** | Detail drawer |
| **Tables** | Timestamp · Level · Tenant · Actor · Action · Request ID · ⋯ |
| **Filters** | Level; Tenant; Actor; Action; Date; Request ID search |
| **Actions** | Copy request ID; View payload |
| **Buttons** | Ghost Refresh; Secondary Export |
| **Empty State** | “No logs for filters” |
| **Loading State** | Table skeleton / live pulse |
| **Desktop** | Dense mono table |
| **Tablet** | Fewer columns |
| **Mobile** | Card rows; JSON in sheet |

**Levels:** Info · Warn · Error · Security (color-coded chips)

---

## Help Center — `/app/help`

**Layout:** Dashboard Layout

| Field | Spec |
|-------|------|
| **Purpose** | In-app help, docs, contact support |
| **Sections** | Search; Category cards; Popular articles; FAQ accordion; Contact support card |
| **Cards** | Getting started · WhatsApp · AI · Billing · Videos |
| **Tables** | — |
| **Forms** | Support ticket form (modal): subject, description, severity, attachments |
| **Filters** | Search only |
| **Actions** | Open article; Contact support; Ask AI (“Help me with…”) |
| **Buttons** | Primary “Contact support”; Accent “Ask AI” |
| **Empty State** | No search results |
| **Loading State** | Category skeletons |
| **Desktop** | Search hero + 3-col categories |
| **Tablet** | 2-col |
| **Mobile** | 1-col; sticky Ask AI |

### Article view (sub-route optional `/app/help/:slug`)

- Breadcrumb Help / Category / Article  
- Prose content EN/AR  
- Related articles  
- “Was this helpful?”  

---

## Cross-page Error / Empty / Loading (Admin & Help)

Reuse global layouts:

- Permission missing → Error Layout 403  
- Failed log fetch → inline error + Retry  
- Help offline → Empty with Retry  
