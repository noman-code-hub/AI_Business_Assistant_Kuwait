import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUi } from "@/app/ui-context";
import { Input } from "@/components/ui/input";
import { customers, invoices } from "@/data/dummy";

const quickLinks = [
  { to: "/app/customers", label: "Customers" },
  { to: "/app/invoices", label: "Invoices" },
  { to: "/app/ai-chat", label: "AI Chat" },
  { to: "/app/appointments", label: "Appointments" },
  { to: "/app/settings", label: "Settings" },
];

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useUi();
  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/40 p-4 pt-[12vh] backdrop-blur-sm">
      <button className="absolute inset-0" aria-label="Close search" onClick={() => setSearchOpen(false)} />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search anything…"
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <button onClick={() => setSearchOpen(false)} aria-label="Close">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent customers
            </p>
            <div className="space-y-1">
              {customers.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to="/app/customers"
                  onClick={() => setSearchOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Invoices
            </p>
            <div className="space-y-1">
              {invoices.slice(0, 3).map((i) => (
                <Link
                  key={i.id}
                  to="/app/invoices"
                  onClick={() => setSearchOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
                >
                  {i.id} · {i.customer}
                </Link>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick navigation
            </p>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
