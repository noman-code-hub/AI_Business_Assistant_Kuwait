import { motion } from "framer-motion";
import {
  CalendarCheck,
  Download,
  FileBarChart,
  FileSpreadsheet,
  Receipt,
  Users,
} from "lucide-react";
import { revenueWeekly, customers, appointments } from "@/data/dummy";
import { formatKwd } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const reports = [
  {
    id: "r1",
    name: "Revenue Report",
    description: "Detailed breakdown of revenue by day, service, and payment method.",
    icon: Receipt,
    format: "PDF & Excel",
    lastGenerated: "22 Jul 2026",
    size: "248 KB",
    highlights: [
      `Total: ${formatKwd(revenueWeekly.reduce((s, d) => s + d.revenue, 0))}`,
      "7-day period",
      "Includes tax summary",
    ],
  },
  {
    id: "r2",
    name: "Customer Report",
    description: "Customer acquisition, retention, and segment analysis.",
    icon: Users,
    format: "PDF & CSV",
    lastGenerated: "21 Jul 2026",
    size: "186 KB",
    highlights: [
      `${customers.length} total customers`,
      `${customers.filter((c) => c.status === "Active").length} active`,
      "VIP & tag breakdown",
    ],
  },
  {
    id: "r3",
    name: "Sales Report",
    description: "Product and service sales performance with top sellers.",
    icon: FileBarChart,
    format: "PDF & Excel",
    lastGenerated: "20 Jul 2026",
    size: "312 KB",
    highlights: ["Top products ranked", "Service revenue split", "MoM comparison"],
  },
  {
    id: "r4",
    name: "Appointments Report",
    description: "Booking volume, no-shows, staff utilization, and peak hours.",
    icon: CalendarCheck,
    format: "PDF & CSV",
    lastGenerated: "22 Jul 2026",
    size: "164 KB",
    highlights: [
      `${appointments.length} this week`,
      "Staff breakdown",
      "Status distribution",
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and download business reports for accounting and planning."
        actions={
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4" />
            Schedule Report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Available Reports" value={String(reports.length)} icon={FileBarChart} />
        <StatCard label="Last Generated" value="Today" change="Revenue & Appointments" icon={Download} />
        <StatCard label="Export Formats" value="PDF, CSV, Excel" icon={FileSpreadsheet} />
        <StatCard label="Scheduled" value="2" change="Weekly auto-send" icon={CalendarCheck} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="group flex h-full flex-col hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950">
                    <report.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
                <CardTitle className="mt-4">{report.name}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {report.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Last: {report.lastGenerated}</span>
                  <span>{report.size}</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  Preview
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
