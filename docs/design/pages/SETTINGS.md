# Settings & Profile

**Layout:** Settings Layout (dual nav) except Profile (Dashboard Layout)

### Settings Secondary Nav

1. Business Profile  
2. Company Information  
3. Users  
4. Roles  
5. Permissions  
6. API Keys  
7. Integrations  
8. Billing  
9. Security  

Sticky save bar on dirty forms.

---

## Business Profile — `/app/settings/business`

| Field | Spec |
|-------|------|
| **Purpose** | Public-facing business identity |
| **Sections** | Logo upload; Display name EN/AR; Vertical; Tagline; Brand color; Public booking slug |
| **Cards** | Branding card; Public link card |
| **Forms** | Branding fields |
| **Actions** | Save; Preview booking page |
| **Buttons** | Primary Save; Secondary Preview |
| **Empty** | Placeholder logo avatar |
| **Loading** | Form skeleton |
| **Desktop** | Form + live preview phone frame |
| **Mobile** | Form only; preview in sheet |

---

## Company Information — `/app/settings/company`

| Field | Spec |
|-------|------|
| **Purpose** | Legal/commercial entity data for invoices |
| **Sections** | Legal name; CR number; Address (Kuwait); Civil ID/Tax fields as needed; Phone; Email; Invoice footer |
| **Cards** | Legal card; Address card |
| **Forms** | Company form |
| **Actions** | Save |
| **Empty/Loading** | Form skeleton |
| **Responsive** | Single column |

---

## Users — `/app/settings/users`

| Field | Spec |
|-------|------|
| **Purpose** | Manage team members |
| **Sections** | Header; Users table; Invite modal |
| **Tables** | Avatar · Name · Email · Role · Status · Last active · ⋯ |
| **Forms** | Invite: email, role, branches |
| **Filters** | Role; Status |
| **Actions** | Invite; Deactivate; Resend invite; Change role |
| **Buttons** | Primary “Invite user” |
| **Empty State** | “Invite your team” |
| **Loading** | Table skeleton |
| **Responsive** | Standard list |

---

## Roles — `/app/settings/roles`

| Field | Spec |
|-------|------|
| **Purpose** | View/edit role templates |
| **Sections** | Role cards (Owner/Admin/Manager/Staff/Readonly); Custom roles list |
| **Cards** | Role summary cards |
| **Tables** | Custom roles table |
| **Forms** | Create role modal |
| **Actions** | Edit permissions link; Duplicate |
| **Buttons** | Primary “Create role” |
| **Empty** | Only system roles |
| **Loading** | Card skeletons |
| **Responsive** | Card grid 3/2/1 |

---

## Permissions — `/app/settings/permissions`

| Field | Spec |
|-------|------|
| **Purpose** | Matrix of role × permission |
| **Sections** | Role selector tabs; Accordion by module; Checkbox matrix |
| **Cards** | Module accordions |
| **Tables** | Permission matrix table |
| **Forms** | Checkbox groups |
| **Actions** | Save matrix |
| **Buttons** | Primary Save; Ghost Reset defaults |
| **Empty** | — |
| **Loading** | Matrix skeleton |
| **Desktop** | Wide matrix |
| **Mobile** | Per-permission switches list (no wide table) |

---

## API Keys — `/app/settings/api-keys`

| Field | Spec |
|-------|------|
| **Purpose** | Issue keys for external integrations |
| **Sections** | Warning callout; Keys table; Create key modal (show secret once) |
| **Tables** | Name · Prefix · Created · Last used · Status · ⋯ |
| **Forms** | Name; Scopes |
| **Actions** | Create; Revoke; Copy |
| **Buttons** | Primary “Create API key” |
| **Empty State** | “No API keys” |
| **Loading** | Table skeleton |
| **Responsive** | Standard |

**Security UX:** Secret shown once in modal with copy; never again.

---

## Integrations — `/app/settings/integrations`

| Field | Spec |
|-------|------|
| **Purpose** | Hub of connected apps |
| **Sections** | Grid of integration cards |
| **Cards** | WhatsApp · OpenAI · Google Calendar · (future) each with status chip Connected/Not connected |
| **Actions** | Connect / Manage |
| **Buttons** | Per-card primary |
| **Empty** | — (always show cards) |
| **Loading** | Card skeletons |
| **Desktop** | 3-col grid |
| **Mobile** | 1-col |

---

## WhatsApp Integration — `/app/settings/integrations/whatsapp`

| Field | Spec |
|-------|------|
| **Purpose** | Connect Meta WhatsApp Cloud API |
| **Sections** | Connection status; Phone number ID; Webhook verify; Template sync; Test send |
| **Cards** | Status; Credentials; Webhook; Test |
| **Forms** | Tokens (masked); Verify token |
| **Actions** | Save; Test message; Disconnect |
| **Buttons** | Primary Save; Accent Test; Destructive Disconnect |
| **Empty** | Not connected CTA |
| **Loading** | Form skeleton |
| **Responsive** | Single column |

---

## OpenAI Integration — `/app/settings/integrations/openai`

| Field | Spec |
|-------|------|
| **Purpose** | AI provider config |
| **Sections** | API key; Default model; Temperature; Max tokens; Monthly cap; Enable tools toggles |
| **Cards** | Provider; Model; Guardrails |
| **Forms** | Key + model selects + toggles |
| **Actions** | Save; Test completion |
| **Buttons** | Primary Save; Accent “Test AI” |
| **Empty/Loading** | Form skeleton |
| **Responsive** | Single column |

---

## Google Calendar — `/app/settings/integrations/google-calendar`

| Field | Spec |
|-------|------|
| **Purpose** | OAuth connect + sync prefs |
| **Sections** | Connect Google; Calendar select; Sync direction; Conflict rules |
| **Cards** | OAuth card; Sync settings |
| **Forms** | Calendar dropdown; Toggles |
| **Actions** | Connect; Disconnect; Save |
| **Buttons** | Primary “Connect Google”; Save |
| **Empty** | Disconnected state with Connect CTA |
| **Loading** | OAuth pending spinner |
| **Responsive** | Single column |

---

## Billing — `/app/settings/billing`

| Field | Spec |
|-------|------|
| **Purpose** | Plan, usage, invoices |
| **Sections** | Current plan card; Usage meters (users/AI/WhatsApp/storage); Plan comparison; Billing history table; Payment method |
| **Cards** | Plan; Usage ×4; Payment |
| **Tables** | Past invoices |
| **Actions** | Upgrade; Download invoice; Update card |
| **Buttons** | Primary “Upgrade plan” |
| **Empty** | No history |
| **Loading** | Billing skeleton |
| **Desktop** | Plan + usage side by side |
| **Mobile** | Stack |

---

## Security — `/app/settings/security`

| Field | Spec |
|-------|------|
| **Purpose** | Account & workspace security |
| **Sections** | Password change; Sessions list; 2FA (future); Login alerts toggle |
| **Cards** | Password; Sessions; Alerts |
| **Tables** | Active sessions (device · IP · Last active) |
| **Forms** | Change password |
| **Actions** | Update password; Revoke session; Revoke all |
| **Buttons** | Primary Save; Destructive “Revoke all” |
| **Empty** | Single current session |
| **Loading** | Form/table skeleton |
| **Responsive** | Single column |

---

## Profile — `/app/profile`

**Layout:** Dashboard (not settings dual-nav)

| Field | Spec |
|-------|------|
| **Purpose** | Personal user profile |
| **Sections** | Avatar; Name EN/AR; Email (readonly); Phone; Language; Timezone; Appearance density |
| **Cards** | Profile; Preferences |
| **Forms** | Profile form |
| **Actions** | Save; Change avatar |
| **Buttons** | Primary Save |
| **Empty/Loading** | Form skeleton |
| **Desktop** | `max-w-3xl` |
| **Mobile** | Full width |
