import { motion } from "framer-motion";
import {
  Eye,
  Mail,
  MessageSquare,
  MousePointerClick,
  Plus,
  Radio,
  Share2,
  Smartphone,
} from "lucide-react";
import { formatKwd } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const campaigns = [
  {
    id: "cp1",
    name: "Summer Wellness Bundle",
    channel: "Email",
    status: "Active",
    sent: 1240,
    opened: 520,
    clicked: 186,
    revenue: 2850,
    startDate: "15 Jul 2026",
  },
  {
    id: "cp2",
    name: "Ramadan Evening Offers",
    channel: "WhatsApp",
    status: "Active",
    sent: 890,
    opened: 678,
    clicked: 312,
    revenue: 4200,
    startDate: "10 Jul 2026",
  },
  {
    id: "cp3",
    name: "Appointment Reminders",
    channel: "SMS",
    status: "Scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    revenue: 0,
    startDate: "25 Jul 2026",
  },
  {
    id: "cp4",
    name: "New Facial Launch",
    channel: "Social",
    status: "Completed",
    sent: 45000,
    opened: 1440,
    clicked: 89,
    revenue: 980,
    startDate: "01 Jul 2026",
  },
  {
    id: "cp5",
    name: "VIP Loyalty Rewards",
    channel: "Email",
    status: "Draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    revenue: 0,
    startDate: "—",
  },
];

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Email: Mail,
  SMS: Smartphone,
  WhatsApp: MessageSquare,
  Social: Share2,
};

const statusVariant: Record<string, "success" | "warning" | "info" | "secondary"> = {
  Active: "success",
  Scheduled: "info",
  Completed: "secondary",
  Draft: "warning",
};

export default function CampaignsPage() {
  const activeCount = campaigns.filter((c) => c.status === "Active").length;
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Track and manage your marketing campaigns across all channels."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Campaigns" value={String(campaigns.length)} icon={Radio} />
        <StatCard label="Active" value={String(activeCount)} icon={MessageSquare} />
        <StatCard label="Total Revenue" value={formatKwd(totalRevenue)} change="+22% this month" icon={MousePointerClick} />
        <StatCard label="Avg. Open Rate" value="58%" change="Across active campaigns" icon={Eye} />
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign, i) => {
          const Icon = channelIcons[campaign.channel] ?? Mail;
          const openRate = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
          const clickRate = campaign.opened > 0 ? Math.round((campaign.clicked / campaign.opened) * 100) : 0;

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>{campaign.name}</CardTitle>
                        <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {campaign.channel} · Started {campaign.startDate}
                      </CardDescription>
                    </div>
                  </div>
                  {campaign.revenue > 0 ? (
                    <p className="text-lg font-semibold text-emerald-600">{formatKwd(campaign.revenue)}</p>
                  ) : null}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Sent</p>
                      <p className="mt-1 text-lg font-semibold">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                      <p className="mt-1 text-lg font-semibold">{openRate}%</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Click Rate</p>
                      <p className="mt-1 text-lg font-semibold">{clickRate}%</p>
                    </div>
                    <div className="rounded-2xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Clicked</p>
                      <p className="mt-1 text-lg font-semibold">{campaign.clicked.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                  <Button variant="ghost" size="sm">
                    Duplicate
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
