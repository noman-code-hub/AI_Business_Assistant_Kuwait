import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, UserX } from "lucide-react";
import type { Appointment, Conversation, Invoice, Payment, Quotation, UpdateCustomerInput } from "@aba/shared";
import { PERMISSIONS } from "@aba/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { Skeleton } from "@/components/feedback/skeleton";
import { CustomerForm, displayCustomerName, formatCustomerDate } from "@/components/customers/customer-form";
import { useCustomerDetail } from "@/hooks/use-customer-detail";
import { usePermissions } from "@/app/providers/permissions-provider";
import { deleteCustomerApi, updateCustomerApi } from "@/services/api/customers.api";
import { ApiClientError } from "@/services/api/client";

type TabId =
  | "overview"
  | "timeline"
  | "appointments"
  | "quotations"
  | "invoices"
  | "payments"
  | "conversations"
  | "notes";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "appointments", label: "Appointments" },
  { id: "quotations", label: "Quotations" },
  { id: "invoices", label: "Invoices" },
  { id: "payments", label: "Payments" },
  { id: "conversations", label: "Conversations" },
  { id: "notes", label: "Notes" },
];

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { detail, loading, error, refresh, tenantId } = useCustomerDetail(customerId);
  const [tab, setTab] = useState<TabId>("overview");
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canUpdate = can(PERMISSIONS.CUSTOMERS_UPDATE);
  const canDelete = can(PERMISSIONS.CUSTOMERS_DELETE);

  async function handleDelete() {
    if (!tenantId || !customerId) return;
    if (!window.confirm("Delete this customer? Related records will be kept.")) return;
    setDeleting(true);
    try {
      await deleteCustomerApi(tenantId, customerId);
      navigate("/app/customers", { replace: true });
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <EmptyState
        icon={UserX}
        title="Customer not found"
        description={error ?? "This customer may have been deleted or you may not have access."}
        action={
          <Button asChild variant="outline">
            <Link to="/app/customers">Back to customers</Link>
          </Button>
        }
      />
    );
  }

  const { customer, timeline, access } = detail;
  const appointments = detail.appointments as Appointment[];
  const quotations = detail.quotations as Quotation[];
  const invoices = detail.invoices as Invoice[];
  const payments = detail.payments as Payment[];
  const conversations = detail.conversations as Conversation[];

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/customers">
            <ArrowLeft className="h-4 w-4" />
            Customers
          </Link>
        </Button>
      </div>

      <PageHeader
        title={displayCustomerName(customer)}
        description={`Customer since ${formatCustomerDate(customer.createdAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {canUpdate ? (
              <Button variant="outline" onClick={() => setEditing((v) => !v)}>
                <Pencil className="h-4 w-4" />
                {editing ? "Cancel edit" : "Edit"}
              </Button>
            ) : null}
            {canDelete ? (
              <Button variant="outline" disabled={deleting} onClick={() => void handleDelete()}>
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            ) : null}
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <Avatar name={displayCustomerName(customer)} className="h-16 w-16" />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              {(customer.tags ?? []).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
              <p>Phone: {customer.phone || "—"}</p>
              <p>WhatsApp: {customer.whatsapp || "—"}</p>
              <p>Email: {customer.email || "—"}</p>
              <p>Source: {customer.source ?? "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && canUpdate ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm
              initial={customer}
              submitLabel="Save changes"
              onCancel={() => setEditing(false)}
              onSubmit={async (payload) => {
                if (!tenantId || !customerId) return;
                await updateCustomerApi(tenantId, customerId, payload as UpdateCustomerInput);
                setEditing(false);
                await refresh();
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <Card>
          <CardContent className="grid gap-3 p-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Address</p>
              <p>{customer.address || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="capitalize">{customer.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p>{formatCustomerDate(customer.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Updated</p>
              <p>{formatCustomerDate(customer.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {tab === "timeline" ? (
        <Card>
          <CardContent className="space-y-4 p-5">
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              timeline.map((event) => (
                <div key={event.id} className="flex gap-3 border-s-2 border-emerald-200 ps-4">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    {event.description ? (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {formatCustomerDate(event.occurredAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}

      {tab === "appointments" ? (
        <RelatedTable
          allowed={access.canViewAppointments}
          empty="No appointments for this customer."
          rows={appointments.map((a) => ({
            id: a.id,
            primary: formatCustomerDate(a.startsAt),
            secondary: a.status,
          }))}
        />
      ) : null}

      {tab === "quotations" ? (
        <RelatedTable
          allowed={access.canViewQuotations}
          empty="No quotations for this customer."
          rows={quotations.map((q) => ({
            id: q.id,
            primary: q.number || "Quotation",
            secondary: `${q.total?.amount ?? "—"} KWD · ${q.status}`,
          }))}
        />
      ) : null}

      {tab === "invoices" ? (
        <RelatedTable
          allowed={access.canViewInvoices}
          empty="No invoices for this customer."
          rows={invoices.map((inv) => ({
            id: inv.id,
            primary: inv.number || "Invoice",
            secondary: `${inv.total?.amount ?? "—"} KWD · ${inv.status}`,
          }))}
        />
      ) : null}

      {tab === "payments" ? (
        <RelatedTable
          allowed={access.canViewPayments}
          empty="No payments linked to this customer's invoices."
          rows={payments.map((p) => ({
            id: p.id,
            primary: formatCustomerDate(p.paidAt ?? p.createdAt),
            secondary: `${p.amount?.amount ?? "—"} KWD · ${p.status}${p.method ? ` · ${p.method}` : ""}`,
          }))}
        />
      ) : null}

      {tab === "conversations" ? (
        <RelatedTable
          allowed={access.canViewConversations}
          empty="No conversations linked to this customer yet."
          rows={conversations.map((c) => ({
            id: c.id,
            primary: c.channel || "Conversation",
            secondary: `${c.status}${c.lastMessageAt ? ` · ${formatCustomerDate(c.lastMessageAt)}` : ""}`,
          }))}
        />
      ) : null}

      {tab === "notes" ? (
        <Card>
          <CardContent className="p-5">
            {customer.notes?.trim() ? (
              <p className="whitespace-pre-wrap text-sm">{customer.notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No notes on file.</p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function RelatedTable({
  allowed,
  empty,
  rows,
}: {
  allowed: boolean;
  empty: string;
  rows: { id: string; primary: string; secondary?: string }[];
}) {
  if (!allowed) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          You do not have permission to view this section.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <span className="font-medium">{row.primary}</span>
                <span className="text-muted-foreground">{row.secondary}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
