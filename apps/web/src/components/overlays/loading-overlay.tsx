import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LoadingOverlay({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-[1px]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
        <span className="inline-block size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-emerald-600" />
        {label}
      </div>
    </div>
  );
}

export function OverlayContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("relative", className)}>{children}</div>;
}
