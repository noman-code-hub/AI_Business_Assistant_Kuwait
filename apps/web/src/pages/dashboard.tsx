import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  MessageSquare,
  Wallet,
  Receipt,
  Bot,
  ListTodo,
  Plus,
  Send,
  FileText,
  Sparkles,
  ArrowUpRight,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  Lightbulb,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/primitives";
import {
  business,
  customers,
  appointments,
  conversations,
  invoices,
  tasks,
  revenueWeekly,
  notifications,
} from "@/data/dummy";
import { cn, formatKwd } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const weeklyRevenue = revenueWeekly.reduce((sum, d) => sum + d.revenue, 0);
const appointmentsToday = appointments.filter((a) => a.date === "Today").length;
const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
const pendingTasks = tasks.filter((t) => t.status === "Todo" || t.status === "In Progress").length;
const overdueInvoices = invoices.filter((i) => i.status === "Overdue").length;
const aiConversations = conversations.filter((c) => c.channel === "AI Chat").length;

const aiSuggestions = [
  { id: 1, title: "Reply to Fatima", body: "Confirm Thursday 3:30 PM with Dr. Layla — slot is available.", action: "Use reply" },
  { id: 2, title: "Follow up Rashid Motors", body: "INV-1040 is 13 days overdue. Send a polite reminder.", action: "Draft message" },
  { id: 3, title: "Upsell opportunity", body: "Maryam booked Facial Glow — suggest Vitamin C Serum bundle.", action: "View offer" },
];

const pendingFollowUps = tasks
  .filter((t) => t.status === "Todo")
  .slice(0, 4);

const quickActions = [
  { label: "New Appointment", icon: CalendarCheck, variant: "default" as const },
  { label: "Send Message", icon: Send, variant: "accent" as const },
  { label: "Create Invoice", icon: FileText, variant: "outline" as const },
  { label: "Ask AI", icon: Sparkles, variant: "outline" as const },
];

function ChartTooltip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean;
  payload?: { value: number; color: string }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-emerald-600">
        {payload[0].value}
        {suffix}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const todayAppointments = appointments.filter((a) => a.date === "Today");
  const recentCustomers = customers.slice(0, 5);
  const recentMessages = conversations.slice(0, 4);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome card */}
      <motion.div variants={item}>
        <Card className="overflow-hidden border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-card to-card dark:border-emerald-900/40 dark:from-emerald-950/40">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="space-y-3">
              <Badge variant="success" className="w-fit">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12% this week
              </Badge>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {getGreeting()}, {business.owner.split(" ")[0]} 👋
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Welcome back to <span className="font-medium text-foreground">{business.name}</span> · {business.city}
                </p>
              </div>
              <p className="max-w-lg text-sm text-muted-foreground">
                You have {appointmentsToday} appointments today, {unreadMessages} unread messages, and {pendingTasks} open tasks.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button key={action.label} variant={action.variant} size="sm" className="rounded-2xl">
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard label="Customers" value={String(customers.length)} change="+2 this month" icon={Users} />
        <StatCard label="Appointments Today" value={String(appointmentsToday)} change="4 confirmed" icon={CalendarCheck} />
        <StatCard label="Unread Messages" value={String(unreadMessages)} change="Needs attention" icon={MessageSquare} />
        <StatCard label="Weekly Revenue" value={formatKwd(weeklyRevenue)} change="+8.4% vs last week" icon={Wallet} />
        <StatCard label="Invoices" value={String(invoices.length)} change={`${overdueInvoices} overdue`} icon={Receipt} />
        <StatCard label="AI Conversations" value={String(aiConversations)} change="Active assistant" icon={Bot} />
        <StatCard label="Pending Tasks" value={String(pendingTasks)} change="2 due today" icon={ListTodo} />
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
            <CardDescription>Total {formatKwd(weeklyRevenue)} across 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueWeekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip content={<ChartTooltip suffix=" KWD" />} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Daily message volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueWeekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="conversations" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Appointments This Week</CardTitle>
            <CardDescription>Bookings per day</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueWeekly} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="appointments" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Latest activities */}
        <motion.div variants={item} className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Latest Activities
                </CardTitle>
                <CardDescription>Recent updates across your workspace</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", n.unread ? "bg-emerald-500" : "bg-border")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {n.category}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming appointments */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Today&apos;s schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center gap-3 rounded-2xl border border-border/60 p-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <span className="text-[10px] font-medium uppercase">Today</span>
                    <span className="text-sm font-semibold">{appt.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{appt.customer}</p>
                    <p className="truncate text-xs text-muted-foreground">{appt.service}</p>
                    <p className="text-xs text-muted-foreground">{appt.staff}</p>
                  </div>
                  <Badge
                    variant={
                      appt.status === "Confirmed" ? "success" : appt.status === "Pending" ? "warning" : "info"
                    }
                  >
                    {appt.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Recent customers */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Customers</CardTitle>
                <CardDescription>Latest interactions</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCustomers.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-muted/50">
                  <Avatar name={c.name} className="h-9 w-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.business}</p>
                  </div>
                  <div className="text-end">
                    <Badge variant={c.status === "Active" ? "success" : "secondary"} className="text-[10px]">
                      {c.status}
                    </Badge>
                    <p className="mt-1 text-[10px] text-muted-foreground">{c.lastVisit}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending follow-ups */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Pending Follow-ups
              </CardTitle>
              <CardDescription>Tasks needing your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingFollowUps.map((t) => (
                <div key={t.id} className="rounded-2xl border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{t.title}</p>
                    <Badge variant={t.priority === "High" ? "danger" : t.priority === "Medium" ? "warning" : "secondary"}>
                      {t.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Due {t.due}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI suggestions */}
        <motion.div variants={item}>
          <Card className="h-full border-emerald-100/80 dark:border-emerald-900/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-emerald-600" />
                AI Suggestions
              </CardTitle>
              <CardDescription>Smart actions for your day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((s) => (
                <div key={s.id} className="rounded-2xl bg-emerald-50/80 p-4 dark:bg-emerald-950/30">
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{s.title}</p>
                  <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-200/80">{s.body}</p>
                  <Button variant="accent" size="sm" className="mt-3">
                    {s.action}
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent messages */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Recent Messages
              </CardTitle>
              <CardDescription>Latest conversations across channels</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Open Inbox
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  className="group cursor-default rounded-2xl border border-border/60 p-4 transition-all hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} className="h-9 w-9" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        {m.unread > 0 ? (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
                            {m.unread}
                          </span>
                        ) : null}
                      </div>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {m.channel}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{m.preview}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{m.time}</span>
                    {m.pinned ? <Badge variant="info">Pinned</Badge> : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
