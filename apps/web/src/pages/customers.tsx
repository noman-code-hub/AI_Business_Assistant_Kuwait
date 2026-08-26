import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { Spinner } from "@/components/feedback/spinner";
import { useCustomers } from "@/hooks/use-customers";
import { useTenant } from "@/app/providers/tenant-provider";
import type { CustomerDoc } from "@/services/firestore";

function formatUpdatedAt(customer: CustomerDoc): string {
  const ts = customer.updatedAt;
  if (!ts || typeof ts.toDate !== "function") return "—";
  return ts.toDate().toLocaleDateString("en-KW", {
    day: "numeric",
    month: "short",
  });
}

export default function CustomersPage() {
  const { tenant } = useTenant();
  const { customers, loading, error, addCustomer } = useCustomers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    business: "",
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => {
      const statusLabel = c.status === "active" ? "Active" : "Inactive";
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").includes(q) ||
        (c.business ?? "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || statusLabel === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setFormError("Name is required");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await addCustomer({
        fullName: form.fullName,
        phone: form.phone || undefined,
        email: form.email || undefined,
        business: form.business || undefined,
        tags: ["New"],
      });
      setForm({ fullName: "", phone: "", email: "", business: "" });
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create customer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description={
          tenant
            ? `Firestore contacts for ${tenant.name}`
            : "Manage contacts stored in Firestore"
        }
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>
            <UserPlus className="h-4 w-4" />
            {showForm ? "Cancel" : "Add customer"}
          </Button>
        }
      />

      {showForm ? (
        <Card className="mb-6">
          <CardContent className="p-5">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void handleCreate(e)}>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Full name</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  placeholder="Fatima Al-Ahmad"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+965 5000 0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@email.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Business</label>
                <Input
                  value={form.business}
                  onChange={(e) => setForm((f) => ({ ...f, business: e.target.value }))}
                  placeholder="Personal"
                />
              </div>
              {formError ? <p className="text-sm text-destructive sm:col-span-2">{formError}</p> : null}
              <div className="sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save to Firestore"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, phone, business…"
              className="ps-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Active", "Inactive"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-muted-foreground">
          <Spinner />
          Loading customers from Firestore…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer — it will be saved under your tenant in Firestore."
          action={
            <Button onClick={() => setShowForm(true)}>
              <UserPlus className="h-4 w-4" />
              Add customer
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-start text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Business</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Tags</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/60 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.fullName} className="h-9 w-9" />
                        <span className="font-medium">{customer.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{customer.phone || "—"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{customer.email || "—"}</td>
                    <td className="px-5 py-4">{customer.business || "Personal"}</td>
                    <td className="px-5 py-4">
                      <Badge variant={customer.status === "active" ? "success" : "secondary"}>
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(customer.tags ?? []).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{formatUpdatedAt(customer)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
