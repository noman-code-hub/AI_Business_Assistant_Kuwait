import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const toneClass: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  neutral: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300",
  info: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300",
};

export type StatusTone = keyof typeof toneClass;

export function StatusChip({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 font-medium", toneClass[tone], className)}>
      {label}
    </Badge>
  );
}
