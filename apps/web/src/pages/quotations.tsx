import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Send, Plus, Search, Building2 } from "lucide-react";
import { quotations, business, services } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { cn, formatKwd } from "@/lib/utils";

type Quotation = (typeof quotations)[number];

function statusVariant(status: string) {
  if (status === "Accepted") return "success" as const;
  if (status === "Declined") return "danger" as const;
  if (status === "Draft") return "secondary" as const;
  return "info" as const;
}

const quoteItems: Record<string, { name: string; qty: number; price: number }[]> = {
  "QT-220": [
    { name: "Corporate Wellness Package", qty: 1, price: 4200 },
    { name: "Spa Day Vouchers (50)", qty: 50, price: 24 },
  ],
  "QT-219": [
    { name: "Facial Glow Package", qty: 40, price: 45 },
    { name: "Deep Tissue Massage", qty: 20, price: 35 },
  ],
  "QT-218": [
    { name: "Executive Health Check", qty: 15, price: 120 },
    { name: "Nutrition Follow-up", qty: 10, price: 20 },
  ],
  "QT-217": [
    { name: "Dermatology Consult", qty: 50, price: 25 },
    { name: "Aromatherapy Kit", qty: 10, price: 35.5 },
  ],
};

function buildPreview(quote: Quotation) {
  const items = quoteItems[quote.id] ?? [
    { name: services[0].name, qty: 1, price: services[0].price },
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = quote.id === "QT-220" ? 200 : quote.id === "QT-218" ? 100 : 0;
  const tax = (subtotal - discount) * 0.05;
  const grandTotal = subtotal - discount + tax;
  return { items, subtotal, discount, tax, grandTotal };
}

export default function QuotationsPage() {
  const [selected, setSelected] = useState<Quotation>(quotations[0]);
  const [search, setSearch] = useState("");
  const preview = buildPreview(selected);

  const filtered = quotations.filter(
    (q) =>
      !search ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Proposals, PDF preview layout, and quote status."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            New quotation
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
                  placeholder="Search quotations…"
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
                    <th className="px-4 py-3 font-medium">Quote</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Valid until</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => setSelected(q)}
                      className={cn(
                        "cursor-pointer border-b border-border/60 transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
                        selected.id === q.id && "bg-emerald-50/80 dark:bg-emerald-950/40"
                      )}
                    >
                      <td className="px-4 py-3 font-medium">{q.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{q.customer}</td>
                      <td className="px-4 py-3">{formatKwd(q.amount)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{q.validUntil}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(q.status)}>{q.status}</Badge>
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
              <Card className="overflow-hidden bg-white shadow-[0_8px_40px_rgba(15,23,42,0.1)] dark:bg-card">
                <CardContent className="p-0">
                  <div className="border-b border-border px-8 py-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white shadow-md">
                          NW
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{business.name}</h2>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            {business.city} · {business.vertical}
                          </p>
                          <p className="text-sm text-muted-foreground">Prepared by {business.owner}</p>
                        </div>
                      </div>
                      <div className="text-start sm:text-end">
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                          Quotation
                        </p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{selected.id}</p>
                        <Badge variant={statusVariant(selected.status)} className="mt-2">
                          {selected.status}
                        </Badge>
                        <p className="mt-2 text-sm text-muted-foreground">Valid until {selected.validUntil}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-6">
                    <div className="mb-8 rounded-2xl border border-border bg-muted/20 p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prepared for</p>
                      <p className="mt-1 text-lg font-semibold">{selected.customer}</p>
                      <p className="text-sm text-muted-foreground">Kuwait</p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-emerald-50/80 text-start dark:bg-emerald-950/30">
                            <th className="px-4 py-3 font-medium">Description</th>
                            <th className="px-4 py-3 font-medium">Qty</th>
                            <th className="px-4 py-3 font-medium">Unit price</th>
                            <th className="px-4 py-3 text-end font-medium">Line total</th>
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

                    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:justify-between">
                      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                        Prices in Kuwaiti Dinar (KWD). Payment terms: 50% upon acceptance, balance within 30 days.
                        This quotation is valid until the date shown above.
                      </p>
                      <div className="min-w-[220px] space-y-2 text-sm">
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
                        <div className="flex justify-between border-t-2 border-emerald-600 pt-3 text-lg font-bold">
                          <span>Grand total</span>
                          <span className="text-emerald-700 dark:text-emerald-400">
                            {formatKwd(preview.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button>
                        <Send className="h-4 w-4" />
                        Send quotation
                      </Button>
                    </div>
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
