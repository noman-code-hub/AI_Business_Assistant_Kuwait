import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Megaphone,
  Share2,
  Smartphone,
  TrendingUp,
  Users,
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
import { revenueWeekly } from "@/data/dummy";
import { formatKwd } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const campaignTypes = [
  {
    id: "email",
    name: "Email",
    icon: Mail,
    desc: "Newsletters, promotions & drip sequences",
    sent: 2840,
    openRate: "42%",
    color: "bg-sky-50 text-sky-600 dark:bg-sky-950",
  },
  {
    id: "sms",
    name: "SMS",
    icon: Smartphone,
    desc: "Appointment reminders & flash offers",
    sent: 1205,
    openRate: "89%",
    color: "bg-violet-50 text-violet-600 dark:bg-violet-950",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageSquare,
    desc: "Broadcasts & template messages",
    sent: 3420,
    openRate: "76%",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950",
  },
  {
    id: "social",
    name: "Social",
    icon: Share2,
    desc: "Instagram, Meta & Google ads",
    sent: 890,
    openRate: "3.2% CTR",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950",
  },
];

const templates = [
  { id: "t1", name: "Summer Spa Promo", channel: "Email", status: "Active" },
  { id: "t2", name: "Appointment Reminder", channel: "SMS", status: "Active" },
  { id: "t3", name: "Ramadan Greeting", channel: "WhatsApp", status: "Draft" },
  { id: "t4", name: "New Service Launch", channel: "Social", status: "Active" },
  { id: "t5", name: "VIP Loyalty Offer", channel: "Email", status: "Active" },
  { id: "t6", name: "Follow-up After Visit", channel: "WhatsApp", status: "Active" },
];

const totalRevenue = revenueWeekly.reduce((s, d) => s + d.revenue, 0);
const totalConversations = revenueWeekly.reduce((s, d) => s + d.conversations, 0);

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing"
        description="Multi-channel campaigns, templates, and performance insights."
        actions={
          <Button>
            <Megaphone className="h-4 w-4" />
            New Campaign
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Weekly Revenue" value={formatKwd(totalRevenue)} change="+12.4%" icon={TrendingUp} />
        <StatCard label="Conversations" value={String(totalConversations)} change="+18 this week" icon={MessageSquare} />
        <StatCard label="Active Templates" value={String(templates.filter((t) => t.status === "Active").length)} icon={Mail} />
        <StatCard label="Reach" value="8.3K" change="Across all channels" icon={Users} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {campaignTypes.map((type, i) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="group cursor-pointer hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${type.color}`}>
                    <type.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <CardTitle className="mt-3">{type.name}</CardTitle>
                <CardDescription>{type.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{type.sent.toLocaleString()} sent</span>
                <Badge variant="success">{type.openRate}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Weekly revenue from marketing channels</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueWeekly}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [formatKwd(Number(v)), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversations by Day</CardTitle>
            <CardDescription>Engagement across the week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="conversations" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Reusable message templates for each channel</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Manage All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.channel}</p>
                </div>
                <Badge variant={template.status === "Active" ? "success" : "secondary"}>{template.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
