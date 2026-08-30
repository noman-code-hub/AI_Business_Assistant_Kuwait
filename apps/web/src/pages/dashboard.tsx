import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  Wallet,
  Receipt,
  Clock,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardRevenueRange } from "@aba/shared";
import { PERMISSIONS } from "@aba/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/primitives";
import { Skeleton } from "@/components/feedback/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { usePermissions } from "@/app/providers/permissions-provider";
import { useTenant } from "@/app/providers/tenant-provider";
import { cn, formatKwd } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const REVENUE_RANGES: { id: DashboardRevenueRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "12m", label: "12 Months" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatMoney(amount: number | null | undefined, currency: string) {
  if (amount == null) return "—";
  if (currency === "KWD") return formatKwd(amount);
  return `${amount.toLocaleString()} ${currency}`;
}

function statusVariant(status: string) {
  if (status === "confirmed" || status === "completed") return "success" as const;
  if (status === "scheduled" || status === "pending") return "warning" as const;
  if (status === "cancelled" || status === "no_show") return "danger" as const;
  return "secondary" as const;
}

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  currency?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-emerald-600">{formatMoney(payload[0]!.value, currency ?? "KWD")}</p>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { tenant, profile } = useTenant();
  const { can } = usePermissions();
  const {
    summary,
    revenue,
    loading,
    revenueLoading,
    error,
    revenueError,
    revenueRange,
    refresh,
    setRevenueRange,
  } = useDashboard();

  const canViewFinancials = can(PERMISSIONS.PAYMENTS_READ);
  const canViewCustomers = can(PERMISSIONS.CUSTOMERS_READ);
  const canViewAppointments = can(PERMISSIONS.APPOINTMENTS_READ);
  const canViewInvoices = can(PERMISSIONS.INVOICES_READ);

  const chartData = useMemo(
    () =>
      revenue?.points.map((p) => ({
        name: p.label,
        revenue: p.revenue,
      })) ?? [],
    [revenue]
  );

  const firstName = profile?.displayName?.split(" ")[0] ?? "there";
  const currency = summary?.currency ?? "KWD";

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-36 rounded-2xl" />
        <SummarySkeleton />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <h2 className="text-lg font-semibold">Unable to load dashboard data</h2>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
          <Button type="button" onClick={() => void refresh()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const s = summary?.summary;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <Card className="overflow-hidden border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-card to-card dark:border-emerald-900/40 dark:from-emerald-950/40">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {getGreeting()}, {firstName} 👋
              </h2>
              <p className="text-muted-foreground">
                Welcome back to{" "}
                <span className="font-medium text-foreground">
                  {summary?.businessName ?? tenant?.name ?? "your business"}
                </span>
                {summary?.timezone ? ` · ${summary.timezone}` : null}
              </p>
              {canViewAppointments && s?.appointmentsToday != null ? (
                <p className="text-sm text-muted-foreground">
                  You have {s.appointmentsToday} appointment{s.appointmentsToday === 1 ? "" : "s"}{" "}
                  today.
                </p>
              ) : null}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {canViewFinancials ? (
          <StatCard
            label="Revenue (Today)"
            value={formatMoney(s?.revenue?.amount, s?.revenue?.currency ?? currency)}
            change="Completed payments"
            icon={Wallet}
          />
        ) : null}
        {canViewCustomers ? (
          <StatCard
            label="Customers"
            value={s?.customers != null ? String(s.customers) : "—"}
            icon={Users}
          />
        ) : null}
        {canViewAppointments ? (
          <StatCard
            label="Appointments Today"
            value={s?.appointmentsToday != null ? String(s.appointmentsToday) : "—"}
            icon={CalendarCheck}
          />
        ) : null}
        {canViewInvoices ? (
          <StatCard
            label="Invoices"
            value={s?.invoices != null ? String(s.invoices) : "—"}
            icon={Receipt}
          />
        ) : null}
        {canViewFinancials ? (
          <StatCard
            label="Pending Payments"
            value={formatMoney(s?.pendingPayments?.amount, s?.pendingPayments?.currency ?? currency)}
            change="Outstanding balance"
            icon={Clock}
          />
        ) : null}
      </motion.div>

      {canViewFinancials ? (
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                  Recognized revenue from completed payments
                  {revenue?.total
                    ? ` · ${formatMoney(revenue.total.amount, revenue.total.currency)}`
                    : ""}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {REVENUE_RANGES.map((r) => (
                  <Button
                    key={r.id}
                    type="button"
                    size="sm"
                    variant={revenueRange === r.id ? "default" : "outline"}
                    onClick={() => setRevenueRange(r.id)}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              {revenueLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : revenueError ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {revenueError}
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No revenue recorded for this period.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip content={<ChartTooltip currency={revenue?.currency} />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fill="url(#dashRevenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {canViewAppointments ? (
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-600" />
                  Today&apos;s Appointments
                </CardTitle>
                <CardDescription>Schedule for today in business timezone</CardDescription>
              </CardHeader>
              <CardContent>
                {!summary?.todayAppointments?.length ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No appointments today.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-start text-muted-foreground">
                          <th className="pb-2 font-medium">Customer</th>
                          <th className="pb-2 font-medium">Service</th>
                          <th className="pb-2 font-medium">Staff</th>
                          <th className="pb-2 font-medium">Time</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.todayAppointments.map((appt) => (
                          <tr key={appt.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pe-2 font-medium">{appt.customerName}</td>
                            <td className="py-3 pe-2 text-muted-foreground">{appt.serviceName}</td>
                            <td className="py-3 pe-2 text-muted-foreground">{appt.staffName}</td>
                            <td className="py-3 pe-2">{appt.time}</td>
                            <td className="py-3">
                              <Badge variant={statusVariant(appt.status)} className="capitalize">
                                {appt.status.replace(/_/g, " ")}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest events in this business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!summary?.recentActivity?.length ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No recent activity yet.
                </p>
              ) : (
                summary.recentActivity.map((act) => (
                  <div
                    key={act.id}
                    className={cn(
                      "rounded-2xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                    )}
                  >
                    <p className="text-sm font-medium capitalize">{act.title}</p>
                    {act.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{act.description}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {act.relativeTime ?? act.createdAt}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
