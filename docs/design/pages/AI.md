# AI Assistant Pages

**Layout:** Dashboard Layout  
**Accent:** Teal `#14B8A6` for AI affordances

---

## AI Assistant — `/app/ai`

| Field | Spec |
|-------|------|
| **Purpose** | Central AI workspace: chat with business co-pilot |
| **Layout** | Split: conversation list (optional) + chat canvas |
| **Sections** | Header; Prompt suggestions; Chat thread; Composer; Context drawer (customer/appointment) |
| **Cards** | Suggestion chips; Tool-result cards (booking created, quote drafted) |
| **Tables** | — |
| **Forms** | Composer (textarea + attach + send) |
| **Filters** | Chat history search |
| **Actions** | New chat; Use tool confirm; Insert into CRM |
| **Buttons** | Accent “Send”; Ghost suggestions; “Confirm action” on tool cards |
| **Empty State** | Hero empty: “Ask anything about your business” + 4 starter prompts |
| **Loading State** | Typing indicator bubbles; skeleton for tool cards |
| **Desktop** | List 280px + chat flex; context drawer 360px |
| **Tablet** | Hide list in sheet |
| **Mobile** | Full chat; history via top icon |

---

## WhatsApp Inbox — `/app/ai/inbox`

| Field | Spec |
|-------|------|
| **Purpose** | Omnichannel WhatsApp inbox (GHL-style) |
| **Layout** | 3-pane: queues · thread · customer context |
| **Sections** | Queue tabs (Open/Pending/Closed); Thread list; Message pane; Contact sidebar |
| **Cards** | Conversation list items; Template picker card |
| **Tables** | — |
| **Forms** | Reply composer; template variables |
| **Filters** | Unread; Assigned to me; AI-handled; Tags |
| **Actions** | Assign; Close; Snooze; Hand off to AI; Translate |
| **Buttons** | Primary Send; Accent “AI suggest reply” |
| **Empty State** | “Connect WhatsApp” or “No conversations” |
| **Loading State** | InboxList skeleton + thread skeleton |
| **Desktop** | 3-pane `320 / 1fr / 320` |
| **Tablet** | 2-pane; context as drawer |
| **Mobile** | List → Thread full screen → Context sheet |

---

## Conversation — `/app/ai/inbox/:id`

Deep-link into a single thread. Same as Inbox message pane focused; on mobile this is the primary view.

| Extra | Spec |
|-------|------|
| **Sections** | Thread header (customer, status); Messages; Composer; Timeline of CRM events |
| **Actions** | Create lead; Book appointment; Create quotation from chat |
| **Empty** | Invalid id → Error |
| **Loading** | ChatThread skeleton |

---

## Knowledge Base — `/app/ai/knowledge`

| Field | Spec |
|-------|------|
| **Purpose** | Manage docs the AI can retrieve (tenant RAG) |
| **Layout** | List + upload panel |
| **Sections** | Header; Upload zone; Documents table; Article editor drawer |
| **Cards** | Source cards (PDF, URL, FAQ sync) |
| **Tables** | Title · Type · Tokens · Updated · Status · ⋯ |
| **Forms** | Upload; URL ingest; Rich text article |
| **Filters** | Type; Status (Indexed/Processing/Failed) |
| **Actions** | Re-index; Delete; Preview chunks |
| **Buttons** | Primary “Add source” |
| **Empty State** | “Train your AI” + upload CTA |
| **Loading State** | Table skeleton; per-row processing spinner |
| **Desktop** | Table + right upload card |
| **Tablet/Mobile** | Stack; upload first |

---

## FAQ — `/app/ai/faq`

| Field | Spec |
|-------|------|
| **Purpose** | Curated Q&A for AI + Help Center sync |
| **Layout** | Accordion list + editor |
| **Sections** | Categories; FAQ accordion; Add FAQ modal |
| **Cards** | Category cards |
| **Tables** | Optional dense list mode |
| **Forms** | Question EN/AR; Answer EN/AR; Category; Publish toggle |
| **Filters** | Category; Published |
| **Actions** | Add; Edit; Publish; Reorder |
| **Buttons** | Primary “Add FAQ” |
| **Empty State** | “No FAQs yet” |
| **Loading State** | Accordion skeletons |
| **Responsive** | Accordion full width; editor as drawer on mobile |
