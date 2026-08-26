import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/feedback/skeleton";
import { MetricCard } from "@/components/data-display/metric-card";

/** @deprecated Prefer importing from components/common|feedback|data-display */
export { Skeleton, EmptyState, PageHeader };

/** @deprecated Prefer MetricCard from components/data-display */
export function StatCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return <MetricCard label={label} value={value} change={change} icon={icon} />;
}

export type { HTMLAttributes, ReactNode };
