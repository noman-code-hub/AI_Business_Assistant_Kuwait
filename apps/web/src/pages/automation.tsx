import { motion } from "framer-motion";
import {
  ArrowRight,
  GitBranch,
  Mail,
  MessageSquare,
  Play,
  Plus,
  Webhook,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { abaMotion } from "@/design-system/motion/tokens";

const workflows = [
  { name: "New lead → WhatsApp welcome", runs: 142, status: "Active", lastRun: "2 min ago" },
  { name: "Appointment reminder (24h)", runs: 89, status: "Active", lastRun: "1 hour ago" },
  { name: "Overdue invoice follow-up", runs: 23, status: "Paused", lastRun: "3 days ago" },
  { name: "Post-visit feedback request", runs: 56, status: "Active", lastRun: "Yesterday" },
];

const flowNodes = [
  { type: "trigger", label: "New WhatsApp message", icon: MessageSquare, color: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { type: "condition", label: "Contains keyword?", icon: GitBranch, color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { type: "action", label: "Send AI reply", icon: Zap, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { type: "action", label: "Notify team via email", icon: Mail, color: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
];

export default function AutomationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Automation"
        description="Build workflows that run while you focus on customers."
        actions={
          <Button type="button">
            <Plus className="h-4 w-4" />
            New workflow
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {workflows.map((wf, idx) => (
          <motion.div
            key={wf.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{wf.name}</CardTitle>
                    <CardDescription className="mt-1">{wf.runs} runs · Last: {wf.lastRun}</CardDescription>
                  </div>
                  <Badge variant={wf.status === "Active" ? "success" : "warning"}>{wf.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Play className="h-3.5 w-3.5" />
                  Run
                </Button>
                <Button type="button" variant="accent" size="sm">
                  Edit flow
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-emerald-600" />
            Flow builder
          </CardTitle>
          <CardDescription>Visual workflow: triggers → conditions → actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-muted/30 p-6 md:p-10">
            <div className="flex min-w-max flex-col items-center gap-0 md:flex-row md:items-start">
              {flowNodes.map((node, idx) => (
                <div key={node.label} className="flex flex-col items-center md:flex-row">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: abaMotion.duration.normal }}
                    className="relative w-56"
                  >
                    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
                      <Badge variant="outline" className="mb-3 capitalize">
                        {node.type}
                      </Badge>
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${node.color}`}>
                        <node.icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium">{node.label}</p>
                    </div>
                    {idx === 1 && (
                      <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-emerald-400 md:block" />
                    )}
                  </motion.div>
                  {idx < flowNodes.length - 1 && (
                    <div className="flex flex-col items-center py-2 md:flex-row md:py-0">
                      <div className="hidden h-px w-12 bg-gradient-to-r from-emerald-300 to-emerald-500 md:block" />
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-600 md:mx-1">
                        <ArrowRight className="h-4 w-4 md:rotate-0 rotate-90" />
                      </div>
                      <div className="hidden h-px w-12 bg-gradient-to-r from-emerald-500 to-emerald-300 md:block" />
                      <div className="h-8 w-px bg-emerald-300 md:hidden" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add trigger
            </Button>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add condition
            </Button>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add action
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
