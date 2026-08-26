import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Circle, Clock, Flag, ListTodo, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { tasks } from "@/data/dummy";
import { abaMotion } from "@/design-system/motion/tokens";
import { cn } from "@/lib/utils";

const columns = ["Todo", "In Progress", "Done"] as const;

const priorityVariant = {
  High: "danger",
  Medium: "warning",
  Low: "secondary",
} as const;

export default function TasksPage() {
  const grouped = useMemo(
    () =>
      columns.reduce(
        (acc, col) => {
          acc[col] = tasks.filter((t) => t.status === col);
          return acc;
        },
        {} as Record<(typeof columns)[number], typeof tasks>
      ),
    []
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tasks"
        description="Track team work across your pipeline."
        actions={
          <Button type="button">
            <Plus className="h-4 w-4" />
            New task
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column, colIdx) => (
          <motion.div
            key={column}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIdx * 0.05, duration: abaMotion.duration.normal }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    {column === "Done" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : column === "In Progress" ? (
                      <Clock className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    {column}
                  </CardTitle>
                  <Badge variant="secondary">{grouped[column].length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {grouped[column].map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: colIdx * 0.05 + idx * 0.03 }}
                    className={cn(
                      "rounded-2xl border border-border/80 bg-background/60 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                      column === "Done" && "opacity-75"
                    )}
                  >
                    <p className={cn("text-sm font-medium", column === "Done" && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={priorityVariant[task.priority as keyof typeof priorityVariant]}>
                        <Flag className="mr-1 h-3 w-3" />
                        {task.priority}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {task.due}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-emerald-600" />
            All tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      task.status === "Done"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border"
                    )}
                  >
                    {task.status === "Done" && <CheckCircle2 className="h-3 w-3" />}
                  </div>
                  <div>
                    <p className={cn("font-medium", task.status === "Done" && "text-muted-foreground line-through")}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{task.status}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-8 sm:pl-0">
                  <Badge variant={priorityVariant[task.priority as keyof typeof priorityVariant]}>{task.priority}</Badge>
                  <Badge variant="outline">{task.due}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
