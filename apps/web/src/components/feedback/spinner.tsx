import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-emerald-600",
        className
      )}
    />
  );
}
