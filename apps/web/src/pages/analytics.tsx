import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueWeekly, customers, appointments } from "@/data/dummy";
import { formatKwd } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const totalRevenue = revenueWeekly.reduce((s, d) => s + d.revenue, 0);
const totalConversations = revenueWeekly.reduce((s, d) => s + d.conversations, 0);
const totalAppointments = revenueWeekly.reduce((s, d) => s + d.appointments, 0);
const activeCustomers = customers.filter((c) => c.status === "Active").length;
const conversionRate = ((totalAppointments / totalConversations) * 100).toFixed(1);

const channelData = [
  { name: "WhatsApp", value: 45, color: "#059669" },
  { name: "AI Chat", value: 25, color: "#0ea5e9" },
  { name: "Email", value: 18, color: "#8b5cf6" },
  { name: "SMS", value: 12, color: "#f59e0b" },
];

const monthlyGrowth = [
  { label: "Revenue", monthly: "+12.4%", yearly: "+48.2%", up: true },
  { label: "Customers", monthly: "+8.1%", yearly: "+32.5%", up: true },
  { label: "Messages", monthly: "+15.3%", yearly: "+62.0%", up: true },
  { label: "Conversion", monthly: "-2.1%", yearly: "+5.8%", up: false },
  { label: "Appointments", monthly: "+10.7%", yearly: "+41.3%", up: true },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Premium insights across revenue, customers, messaging, and bookings."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Revenue (7d)" value={formatKwd(totalRevenue)} change="+12.4%" icon={Wallet} />
        <StatCard label="Customers" value={String(customers.length)} change={`${activeCustomers} active`} icon={Users} />
        <StatCard label="Messages (7d)" value={String(totalConversations)} change="+15.3%" icon={MessageSquare} />
        <StatCard label="Conversion" value={`${conversionRate}%`} change="Appt / conversation" icon={TrendingUp} />
        <StatCard label="Appointments (7d)" value={String(totalAppointments)} change="+10.7%" icon={CalendarCheck} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {monthlyGrowth.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Monthly</span>
                    <span className={`flex items-center gap-0.5 text-sm font-semibold ${item.up ? "text-emerald-600" : "text-red-500"}`}>
                      {item.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {item.monthly}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Yearly</span>
                    <span className="flex items-center gap-0.5 text-sm font-semibold text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {item.yearly}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueWeekly}>
                <defs>
                  <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [formatKwd(Number(v)), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="url(#analyticsRevenue)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Mix</CardTitle>
            <CardDescription>Conversation sources</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {channelData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Day</CardTitle>
            <CardDescription>Booking volume this week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages vs Appointments</CardTitle>
            <CardDescription>Engagement funnel comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversations" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Messages" />
                <Bar dataKey="appointments" fill="#059669" radius={[4, 4, 0, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest bookings from analytics period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {appointments.slice(0, 4).map((appt) => (
              <div key={appt.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{appt.customer}</p>
                  <p className="text-sm text-muted-foreground">{appt.service}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {appt.date} · {appt.time}
                  </span>
                  <Badge variant={appt.status === "Confirmed" ? "success" : appt.status === "Pending" ? "warning" : "info"}>
                    {appt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
