import { motion } from "framer-motion";
import {
  Clock,
  HeartPulse,
  Leaf,
  Plus,
  Sparkles,
  Stethoscope,
  Timer,
} from "lucide-react";
import { services } from "@/data/dummy";
import { formatKwd } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Medical: Stethoscope,
  Spa: Leaf,
  Beauty: Sparkles,
  Wellness: HeartPulse,
};

export default function ServicesPage() {
  const activeCount = services.filter((s) => s.status === "Active").length;
  const avgPrice = services.reduce((sum, s) => sum + s.price, 0) / services.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Your service menu — pricing, duration, and availability."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Services" value={String(services.length)} icon={Sparkles} />
        <StatCard label="Active" value={String(activeCount)} change={`${services.length - activeCount} draft`} icon={HeartPulse} />
        <StatCard label="Avg. Price" value={formatKwd(avgPrice)} icon={Timer} />
        <StatCard label="Categories" value={String(new Set(services.map((s) => s.category)).size)} icon={Clock} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service, i) => {
          const Icon = categoryIcons[service.category] ?? Sparkles;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="group h-full hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={service.status === "Active" ? "success" : "secondary"}>
                      {service.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{service.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {service.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </div>
                  <p className="text-2xl font-semibold text-emerald-600">{formatKwd(service.price)}</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="accent" size="sm" className="flex-1">
                    Book
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
