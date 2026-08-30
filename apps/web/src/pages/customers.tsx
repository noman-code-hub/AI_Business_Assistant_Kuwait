import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import type {
  CreateCustomerInput,
  CustomerImportPreviewResponse,
  CustomerImportPreviewRow,
  CustomerImportResult,
} from "@aba/shared";
import { PERMISSIONS } from "@aba/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { Spinner } from "@/components/feedback/spinner";
import { Skeleton } from "@/components/feedback/skeleton";
import { CustomerForm, displayCustomerName, formatCustomerDate } from "@/components/customers/customer-form";
import { useCustomers } from "@/hooks/use-customers";
import { useTenant } from "@/app/providers/tenant-provider";
import { usePermissions } from "@/app/providers/permissions-provider";
import {
  CUSTOMER_CSV_TEMPLATE,
  confirmCustomerImport,
  downloadCsv,
  exportCustomersApi,
  previewCustomerImport,
} from "@/services/api/customers.api";
import { ApiClientError } from "@/services/api/client";

export default function CustomersPage() {
  const navigate = useNavigate();
  const { tenant, tenantId } = useTenant();
  const { can } = usePermissions();
  const canCreate = can(PERMISSIONS.CUSTOMERS_CREATE);
  const canRead = can(PERMISSIONS.CUSTOMERS_READ);

  const {
    customers,
    pagination,
    loading,
    error,
    params,
    setParams,
    refresh,
    createCustomer,
  } = useCustomers();

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importCsv, setImportCsv] = useState("");
  const [importPreview, setImportPreview] = useState<CustomerImportPreviewResponse | null>(null);
  const [importResult, setImportResult] = useState<CustomerImportResult | null>(null);
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [exportBusy, setExportBusy] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setParams({ search: searchInput.trim() || undefined, page: 1 });
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchInput, setParams]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const c of customers) {
      for (const tag of c.tags ?? []) set.add(tag);
    }
    return [...set].sort();
  }, [customers]);

  async function handleExport() {
    if (!tenantId) return;
    setExportBusy(true);
    try {
      const result = await exportCustomersApi(tenantId);
      downloadCsv(result.csv, result.filename);
    } catch (err) {
      alert(err instanceof ApiClientError ? err.message : "Export failed");
    } finally {
      setExportBusy(false);
    }
  }

  async function handleFileSelect(file: File) {
    const text = await file.text();
    setImportCsv(text);
    setImportPreview(null);
    setImportResult(null);
    setImportError(null);
  }

  async function handlePreviewImport() {
    if (!tenantId || !importCsv.trim()) return;
    setImportBusy(true);
    setImportError(null);
    try {
      const preview = await previewCustomerImport(tenantId, importCsv);
      setImportPreview(preview);
      setImportResult(null);
    } catch (err) {
      setImportError(err instanceof ApiClientError ? err.message : "Import preview failed");
    } finally {
      setImportBusy(false);
    }
  }

  async function handleConfirmImport() {
    if (!tenantId || !importCsv.trim()) return;
    setImportBusy(true);
    setImportError(null);
    try {
      const result = await confirmCustomerImport(tenantId, importCsv);
      setImportResult(result);
      setImportPreview(null);
      await refresh();
    } catch (err) {
      setImportError(err instanceof ApiClientError ? err.message : "Import failed");
    } finally {
      setImportBusy(false);
    }
  }

  if (!canRead) {
    return (
      <EmptyState
        icon={Users}
        title="Access denied"
        description="You do not have permission to view customers."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description={tenant ? `CRM for ${tenant.name}` : "Manage your customer database"}
        actions={
          <div className="flex flex-wrap gap-2">
            {canCreate ? (
              <>
                <Button variant="outline" onClick={() => void handleExport()} disabled={exportBusy}>
                  <Download className="h-4 w-4" />
                  {exportBusy ? "Exporting…" : "Export CSV"}
                </Button>
                <Button variant="outline" onClick={() => setShowImport((v) => !v)}>
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
                <Button onClick={() => setShowForm((v) => !v)}>
                  <UserPlus className="h-4 w-4" />
                  {showForm ? "Cancel" : "Add customer"}
                </Button>
              </>
            ) : null}
          </div>
        }
      />

      {showForm && canCreate ? (
        <Card className="mb-6">
          <CardContent className="p-5">
            <CustomerForm
              submitLabel="Create customer"
              onCancel={() => setShowForm(false)}
              onSubmit={async (payload) => {
                await createCustomer(payload as CreateCustomerInput);
                setShowForm(false);
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      {showImport && canCreate ? (
        <Card className="mb-6">
          <CardContent className="space-y-4 p-5">
            <div>
              <h3 className="font-semibold">Import customers</h3>
              <p className="text-sm text-muted-foreground">
                Upload a CSV, preview validation, then confirm. Max 5,000 rows.{" "}
                <button
                  type="button"
                  className="text-emerald-700 underline"
                  onClick={() => downloadCsv(CUSTOMER_CSV_TEMPLATE, "customers-template.csv")}
                >
                  Download template
                </button>
              </p>
            </div>
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileSelect(file);
              }}
            />
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 font-mono text-xs"
              value={importCsv}
              onChange={(e) => setImportCsv(e.target.value)}
              placeholder="Or paste CSV here…"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={importBusy || !importCsv.trim()}
                onClick={() => void handlePreviewImport()}
              >
                Preview import
              </Button>
              <Button
                type="button"
                disabled={importBusy || !importCsv.trim()}
                onClick={() => void handleConfirmImport()}
              >
                {importBusy ? "Importing…" : "Confirm import"}
              </Button>
            </div>
            {importError ? <p className="text-sm text-destructive">{importError}</p> : null}
            {importPreview ? (
              <div className="rounded-xl border border-border p-3 text-sm">
                <p>
                  Preview: {importPreview.summary.valid} valid, {importPreview.summary.invalid}{" "}
                  invalid, {importPreview.summary.duplicates} duplicates (of{" "}
                  {importPreview.summary.total} rows)
                </p>
                <ul className="mt-2 max-h-40 space-y-1 overflow-auto">
                  {importPreview.rows.slice(0, 20).map((row: CustomerImportPreviewRow) => (
                    <li key={row.row} className={row.valid ? "text-emerald-700" : "text-destructive"}>
                      Row {row.row}: {row.data.name || "(no name)"} —{" "}
                      {row.valid ? "OK" : row.errors.join("; ")}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {importResult ? (
              <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                <p>
                  Imported {importResult.created} created, {importResult.duplicates} duplicates,{" "}
                  {importResult.failed} failed.
                </p>
                {importResult.results
                  .filter((r) => r.status !== "created")
                  .map((r) => (
                    <p key={r.row} className="text-destructive">
                      Row {r.row}
                      {r.name ? ` (${r.name})` : ""}: {r.status}
                      {r.message ? ` — ${r.message}` : ""}
                    </p>
                  ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, email, tags…"
              className="ps-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search customers"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              value={params.tag ?? ""}
              onChange={(e) => setParams({ tag: e.target.value || undefined, page: 1 })}
              aria-label="Filter by tag"
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              value={`${params.sortBy ?? "createdAt"}-${params.sortOrder ?? "desc"}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-") as [
                  "name" | "createdAt" | "updatedAt",
                  "asc" | "desc",
                ];
                setParams({ sortBy, sortOrder, page: 1 });
              }}
              aria-label="Sort customers"
            >
              <option value="createdAt-desc">Newest first</option>
              <option value="createdAt-asc">Oldest first</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="updatedAt-desc">Recently updated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="space-y-2 p-4 text-sm">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchInput || params.tag ? "No customers found" : "No customers yet"}
          description={
            searchInput || params.tag
              ? "Try a different search or clear filters."
              : "Add your first customer to start building your CRM."
          }
          action={
            canCreate && !searchInput && !params.tag ? (
              <Button onClick={() => setShowForm(true)}>
                <UserPlus className="h-4 w-4" />
                Add customer
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-start text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Tags</th>
                    <th className="px-5 py-3 font-medium">Source</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, i) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="cursor-pointer border-b border-border/60 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                      onClick={() => navigate(`/app/customers/${customer.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={displayCustomerName(customer)} className="h-9 w-9" />
                          <span className="font-medium">{displayCustomerName(customer)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{customer.phone || "—"}</td>
                      <td className="px-5 py-4 text-muted-foreground">{customer.email || "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(customer.tags ?? []).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 capitalize">{customer.source ?? "—"}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatCustomerDate(customer.createdAt)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-3 md:hidden">
            {customers.map((customer) => (
              <Card
                key={customer.id}
                className="cursor-pointer"
                onClick={() => navigate(`/app/customers/${customer.id}`)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <Avatar name={displayCustomerName(customer)} className="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{displayCustomerName(customer)}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone || customer.email || "—"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(customer.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.total > (params.pageSize ?? 20) ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} · {pagination.total} customers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setParams({ page: Math.max(1, (params.page ?? 1) - 1) })}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasMore}
                  onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {!loading && customers.length > 0 ? (
        <p className="mt-4 text-center text-xs text-muted-foreground md:hidden">
          Tap a customer to view details.
        </p>
      ) : null}

      <p className="sr-only">
        <Link to="/app/customers">Customers list</Link>
      </p>
    </div>
  );
}
