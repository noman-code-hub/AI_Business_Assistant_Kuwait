import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Send, Plus, Search } from "lucide-react";
import { invoices, business, products } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { cn, formatKwd } from "@/lib/utils";

type Invoice = (typeof invoices)[number];

function statusVariant(status: string) {
  if (status === "Paid") return "success" as const;
  if (status === "Overdue") return "danger" as const;
  if (status === "Draft") return "secondary" as const;
  return "info" as const;
}

const invoiceItems: Record<string, { name: string; qty: number; price: number }[]> = {
  "INV-1042": [
    { name: "Executive Health Check", qty: 2, price: 120 },
    { name: "Vitamin C Serum", qty: 3, price: 18.5 },
  ],
  "INV-1041": [{ name: "Dermatology Consult", qty: 1, price: 25 }],
  "INV-1040": [
    { name: "Fleet Vehicle Check", qty: 4, price: 200 },
    { name: "Massage Oil Set", qty: 2, price: 12.75 },
  ],
  "INV-1039": [{ name: "Deep Tissue Massage", qty: 1, price: 35 }],
  "INV-1038": [{ name: "Clinic Gift Card", qty: 3, price: 50 }],
};

function buildPreview(invoice: Invoice) {
  const items = invoiceItems[invoice.id] ?? [
    { name: products[0].name, qty: 1, price: products[0].price },
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = invoice.id === "INV-1042" ? 15 : 0;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;
  return { items, subtotal, discount, tax, total };
}

export default function InvoicesPage() {
  const [selected, setSelected] = useState<Invoice>(invoices[0]);
  const [search, setSearch] = useState("");
  const preview = buildPreview(selected);

  const filtered = invoices.filter(
    (inv) =>
      !search ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Billing, payment status, and invoice preview."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <Card className="mb-4 overflow-hidden">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search invoices…"
                  className="ps-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-start text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelected(inv)}
                      className={cn(
                        "cursor-pointer border-b border-border/60 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
                        selected.id === inv.id && "bg-emerald-50/80 dark:bg-emerald-950/40"
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{inv.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{inv.customer}</td>
                      <td className="px-4 py-3">{formatKwd(inv.amount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-4 border-b border-border bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm opacity-90">{business.name}</p>
                    <h2 className="text-2xl font-bold tracking-tight">{selected.id}</h2>
                    <p className="mt-1 text-sm opacity-90">{selected.date}</p>
                  </div>
                  <Badge
                    variant={statusVariant(selected.status)}
                    className="w-fit border-white/20 bg-white/15 text-white"
                  >
                    {selected.status}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bill to</p>
                      <p className="mt-1 font-semibold">{selected.customer}</p>
                      <p className="text-sm text-muted-foreground">Kuwait City, Kuwait</p>
                    </div>
                    <div className="sm:text-end">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">From</p>
                      <p className="mt-1 font-semibold">{business.name}</p>
                      <p className="text-sm text-muted-foreground">{business.city}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-start text-muted-foreground">
                          <th className="px-4 py-3 font-medium">Item</th>
                          <th className="px-4 py-3 font-medium">Qty</th>
                          <th className="px-4 py-3 font-medium">Price</th>
                          <th className="px-4 py-3 text-end font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.items.map((item) => (
                          <tr key={item.name} className="border-b border-border/60">
                            <td className="px-4 py-3">{item.name}</td>
                            <td className="px-4 py-3">{item.qty}</td>
                            <td className="px-4 py-3">{formatKwd(item.price)}</td>
                            <td className="px-4 py-3 text-end">{formatKwd(item.qty * item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 ms-auto max-w-xs space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatKwd(preview.subtotal)}</span>
                    </div>
                    {preview.discount > 0 ? (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-{formatKwd(preview.discount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (5%)</span>
                      <span>{formatKwd(preview.tax)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                      <span>Total</span>
                      <span className="text-emerald-700 dark:text-emerald-400">{formatKwd(preview.total)}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button>
                      <Send className="h-4 w-4" />
                      Send to customer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
