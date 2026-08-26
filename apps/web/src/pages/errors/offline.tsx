import { motion } from "framer-motion";
import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { abaMotion } from "@/design-system/motion/tokens";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-slate-100/50 p-6 text-center dark:to-slate-900/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: abaMotion.duration.normal }}
        className="max-w-md"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          <WifiOff className="h-10 w-10" />
        </motion.div>
        <h1 className="mt-8 text-2xl font-semibold">You&apos;re offline</h1>
        <p className="mt-2 text-muted-foreground">
          Check your internet connection and try again. Some features may be unavailable until you&apos;re back
          online.
        </p>
        <Button type="button" className="mt-8" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Retry connection
        </Button>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/50 p-4 text-left text-sm text-muted-foreground">
          <p className="font-medium text-foreground">While offline you can:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>View cached conversations</li>
            <li>Draft messages (sent when online)</li>
            <li>Browse saved knowledge articles</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
