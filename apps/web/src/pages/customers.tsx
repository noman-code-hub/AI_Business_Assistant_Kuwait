import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Building2,
  StickyNote,
  Clock,
  Activity,
  ShoppingBag,
  FileText,
  CalendarDays,
  UserPlus,
} from "lucide-react";
import { customers, appointments, invoices } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { cn, formatKwd } from "@/lib/utils";
import { abaMotion } from "@/design-system/motion/tokens";

type Customer = (typeof customers)[number];

const PAGE_SIZE = 5;

function statusVariant(status: string) {
  if (status === "Active") return "success" as const;
  return "secondary" as const;
}

function tagVariant(tag: string) {
  if (tag === "VIP") return "warning" as const;
  if (tag === "Lead" || tag === "New") return "info" as const;
  return "outline" as const;
}

const profileNotes: Record<string, string> = {
  c1: "Prefers afternoon appointments. Allergic to certain facial products — check before spa services.",
  c2: "Corporate account contact. Interested in fleet wellness packages.",
  c3: "Inactive since July. Send re-engagement offer for spa services.",
  c4: "High-value corporate client. Executive health checks quarterly.",
  c5: "New customer — first visit today. Referral from Fatima Al-Ahmad.",
  c6: "Fleet account — 4 vehicles scheduled for checkups next week.",
};

const timelineFor = (customer: Customer) => [
  { label: "Last visit", value: customer.lastVisit, icon: CalendarDays },
  { label: "Status updated", value: "2 days ago", icon: Activity },
  { label: "WhatsApp chat", value: "Yesterday", icon: Phone },
  { label: "Profile created", value: "15 Jun 2026", icon: UserPlus },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [drawerTab, setDrawerTab] = useState<
    "notes" | "timeline" | "activity" | "purchases" | "invoices" | "appointments"
  >("notes");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.business.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const customerAppointments = selected
    ? appointments.filter((a) => a.customer === selected.name)
    : [];
  const customerInvoices = selected
    ? invoices.filter((i) => i.customer === selected.name || i.customer === selected.business)
    : [];

  const purchases = customerInvoices.map((inv) => ({
    id: inv.id,
    label: `Invoice ${inv.id}`,
    amount: inv.amount,
    date: inv.date,
  }));

  return (
    <div className="relative">
      <PageHeader
        title="Customers"
        description="Manage contacts, tags, and customer profiles for Noor Wellness Kuwait."
        actions={
          <Button>
            <UserPlus className="h-4 w-4" />
            Add customer
          </Button>
        }
      />

      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, phone, business…"
              className="ps-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            {(["All", "Active", "Inactive"] as const).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <th className="px-5 py-3 font-medium">Last visit</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="cursor-pointer border-b border-border/60 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                  onClick={() => {
                    setSelected(customer);
                    setDrawerTab("notes");
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.name} className="h-9 w-9" />
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.phone}</td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.email}</td>
                  <td className="px-5 py-4">{customer.business}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant(customer.status)}>{customer.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <Badge key={tag} variant={tagVariant(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{customer.lastVisit}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                size="sm"
                className="min-w-9"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selected ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              initial={abaMotion.variants.drawer.initial}
              animate={abaMotion.variants.drawer.animate}
              exit={abaMotion.variants.drawer.exit}
              transition={{ duration: abaMotion.duration.normal, ease: abaMotion.ease }}
              className="fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col border-s border-border bg-card shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.name} className="h-12 w-12" />
                  <div>
                    <h2 className="text-lg font-semibold">{selected.name}</h2>
                    <Badge variant={statusVariant(selected.status)} className="mt-1">
                      {selected.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 border-b border-border px-5 py-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  {selected.business}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant={tagVariant(tag)}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2">
                {(
                  [
                    ["notes", StickyNote],
                    ["timeline", Clock],
                    ["activity", Activity],
                    ["purchases", ShoppingBag],
                    ["invoices", FileText],
                    ["appointments", CalendarDays],
                  ] as const
                ).map(([tab, Icon]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDrawerTab(tab)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium capitalize transition-colors",
                      drawerTab === tab
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {drawerTab === "notes" && (
                  <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                    {profileNotes[selected.id] ?? "No notes yet for this customer."}
                  </div>
                )}

                {drawerTab === "timeline" && (
                  <ul className="space-y-4">
                    {timelineFor(selected).map((item, i) => (
                      <li key={item.label} className="flex gap-3">
                        <div className="relative flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                            <item.icon className="h-4 w-4" />
                          </div>
                          {i < timelineFor(selected).length - 1 ? (
                            <div className="mt-1 w-px flex-1 bg-border" />
                          ) : null}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {drawerTab === "activity" && (
                  <ul className="space-y-3">
                    {[
                      "Opened WhatsApp conversation",
                      "Viewed quotation QT-220",
                      "Confirmed appointment reminder",
                      "Received invoice INV-1041",
                    ].map((act) => (
                      <li
                        key={act}
                        className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm"
                      >
                        <Activity className="h-4 w-4 shrink-0 text-emerald-600" />
                        {act}
                      </li>
                    ))}
                  </ul>
                )}

                {drawerTab === "purchases" && (
                  <ul className="space-y-2">
                    {purchases.length ? (
                      purchases.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm"
                        >
                          <span>{p.label}</span>
                          <span className="font-medium text-emerald-700">{formatKwd(p.amount)}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No purchases recorded.</p>
                    )}
                  </ul>
                )}

                {drawerTab === "invoices" && (
                  <ul className="space-y-2">
                    {customerInvoices.length ? (
                      customerInvoices.map((inv) => (
                        <li
                          key={inv.id}
                          className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm"
                        >
                          <div>
                            <p className="font-medium">{inv.id}</p>
                            <p className="text-xs text-muted-foreground">{inv.date}</p>
                          </div>
                          <div className="text-end">
                            <p className="font-medium">{formatKwd(inv.amount)}</p>
                            <Badge variant={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "danger" : "info"}>
                              {inv.status}
                            </Badge>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No invoices linked.</p>
                    )}
                  </ul>
                )}

                {drawerTab === "appointments" && (
                  <ul className="space-y-2">
                    {customerAppointments.length ? (
                      customerAppointments.map((apt) => (
                        <li
                          key={apt.id}
                          className="rounded-2xl border border-border px-4 py-3 text-sm"
                        >
                          <p className="font-medium">{apt.service}</p>
                          <p className="text-muted-foreground">
                            {apt.date} · {apt.time} · {apt.staff}
                          </p>
                          <Badge variant="info" className="mt-2">
                            {apt.status}
                          </Badge>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
                    )}
                  </ul>
                )}
              </div>

              <div className="border-t border-border p-4">
                <Button className="w-full">Message on WhatsApp</Button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
