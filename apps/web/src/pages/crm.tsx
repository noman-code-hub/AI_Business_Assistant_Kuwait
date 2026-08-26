import { motion } from "framer-motion";
import { GripVertical, Plus, TrendingUp, Target, Trophy, XCircle } from "lucide-react";
import { leads, pipelineStages } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { cn, formatKwd } from "@/lib/utils";

const stageStyles: Record<string, { header: string; dot: string }> = {
  Lead: { header: "border-s-sky-400", dot: "bg-sky-500" },
  Qualified: { header: "border-s-violet-400", dot: "bg-violet-500" },
  Proposal: { header: "border-s-amber-400", dot: "bg-amber-500" },
  Negotiation: { header: "border-s-orange-400", dot: "bg-orange-500" },
  Won: { header: "border-s-emerald-500", dot: "bg-emerald-500" },
  Lost: { header: "border-s-red-400", dot: "bg-red-500" },
};

export default function CrmPage() {
  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const wonValue = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + l.value, 0);
  const activeDeals = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost").length;
  const winRate = Math.round((leads.filter((l) => l.stage === "Won").length / leads.length) * 100);

  return (
    <div>
      <PageHeader
        title="CRM Pipeline"
        description="Visual sales pipeline — drag handles are decorative (UI only)."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Add lead
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pipeline value" value={formatKwd(totalValue)} change="+12% this month" icon={TrendingUp} />
        <StatCard label="Active deals" value={String(activeDeals)} icon={Target} />
        <StatCard label="Won revenue" value={formatKwd(wonValue)} icon={Trophy} />
        <StatCard label="Win rate" value={`${winRate}%`} icon={XCircle} />
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[1100px] gap-4">
          {pipelineStages.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            const stageTotal = stageLeads.reduce((s, l) => s + l.value, 0);
            const style = stageStyles[stage] ?? stageStyles.Lead;

            return (
              <div key={stage} className="flex w-72 shrink-0 flex-col">
                <div
                  className={cn(
                    "mb-3 rounded-2xl border border-border border-s-4 bg-card px-4 py-3 shadow-sm",
                    style.header
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                      <h3 className="font-semibold">{stage}</h3>
                    </div>
                    <Badge variant="secondary">{stageLeads.length}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatKwd(stageTotal)}</p>
                </div>

                <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-muted/30 p-2">
                  {stageLeads.map((lead, i) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="cursor-grab transition-shadow hover:shadow-md active:cursor-grabbing">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 cursor-grab text-muted-foreground/60 hover:text-emerald-600">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium leading-tight">{lead.name}</p>
                              <p className="mt-2 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                                {formatKwd(lead.value)}
                              </p>
                              <div className="mt-3 flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {lead.owner}
                                </Badge>
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                  {lead.id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
                  >
                    <Plus className="h-4 w-4" />
                    Add card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
