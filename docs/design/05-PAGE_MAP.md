# Page Map & Route Registry

| Page | Route | Layout |
|------|-------|--------|
| Login | `/login` | Auth |
| Register | `/register` | Auth |
| Forgot Password | `/forgot-password` | Auth |
| Reset Password | `/reset-password` | Auth |
| Verify Email | `/verify-email` | Auth |
| Home Dashboard | `/app/dashboard` | Dashboard |
| Customer List | `/app/customers` | Dashboard |
| Customer Details | `/app/customers/:id` | Dashboard |
| Add Customer | `/app/customers/new` | Dashboard |
| Edit Customer | `/app/customers/:id/edit` | Dashboard |
| Appointments | `/app/appointments` | Dashboard |
| Calendar | `/app/calendar` | Dashboard |
| Booking | `/app/appointments/new` | Dashboard |
| Reschedule | `/app/appointments/:id/reschedule` | Dashboard |
| AI Assistant | `/app/ai` | Dashboard |
| WhatsApp Inbox | `/app/ai/inbox` | Dashboard |
| Conversation | `/app/ai/inbox/:id` | Dashboard |
| Knowledge Base | `/app/ai/knowledge` | Dashboard |
| FAQ | `/app/ai/faq` | Dashboard |
| Quotation List | `/app/quotations` | Dashboard |
| Create Quotation | `/app/quotations/new` | Dashboard |
| Preview PDF (Quote) | `/app/quotations/:id/preview` | Dashboard |
| Invoice List | `/app/invoices` | Dashboard |
| Create Invoice | `/app/invoices/new` | Dashboard |
| Receipt | `/app/invoices/:id/receipt` | Dashboard |
| Lead List | `/app/leads` | Dashboard |
| Pipeline | `/app/leads/pipeline` | Dashboard |
| Lead Details | `/app/leads/:id` | Dashboard |
| Notification Center | `/app/notifications` | Dashboard |
| Sales Reports | `/app/reports/sales` | Dashboard |
| Appointment Reports | `/app/reports/appointments` | Dashboard |
| Customer Reports | `/app/reports/customers` | Dashboard |
| AI Analytics | `/app/reports/ai` | Dashboard |
| Business Profile | `/app/settings/business` | Settings |
| Company Information | `/app/settings/company` | Settings |
| Users | `/app/settings/users` | Settings |
| Roles | `/app/settings/roles` | Settings |
| Permissions | `/app/settings/permissions` | Settings |
| API Keys | `/app/settings/api-keys` | Settings |
| Integrations | `/app/settings/integrations` | Settings |
| WhatsApp Integration | `/app/settings/integrations/whatsapp` | Settings |
| OpenAI Integration | `/app/settings/integrations/openai` | Settings |
| Google Calendar | `/app/settings/integrations/google-calendar` | Settings |
| Billing | `/app/settings/billing` | Settings |
| Security | `/app/settings/security` | Settings |
| Profile | `/app/profile` | Dashboard |
| Business Management | `/app/admin/businesses` | Admin |
| Platform Analytics | `/app/admin/analytics` | Admin |
| Logs | `/app/admin/logs` | Admin |
| Help Center | `/app/help` | Dashboard |
| 404 / 403 / 500 | `/error/*` | Error |

## Page Spec Template (used in all page docs)

Every page documents:

1. Purpose  
2. Layout  
3. Sections  
4. Cards / Tables / Forms / Filters  
5. Actions & Buttons  
6. Empty State  
7. Loading State  
8. Responsive: Desktop · Tablet · Mobile  
