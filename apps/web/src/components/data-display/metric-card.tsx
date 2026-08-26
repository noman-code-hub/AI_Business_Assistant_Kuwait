import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  change?: string;
  icon: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {change ? <p className="mt-2 text-xs font-medium text-emerald-600">{change}</p> : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
