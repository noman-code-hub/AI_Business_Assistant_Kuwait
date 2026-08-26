import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { abaMotion } from "@/design-system/motion/tokens";

export default function ServerErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-red-50/20 p-6 text-center dark:to-red-950/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: abaMotion.duration.normal }}
        className="max-w-md"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <p className="mt-6 text-6xl font-bold tracking-tighter text-red-600">500</p>
        <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          Our servers encountered an unexpected error. Our team has been notified.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" variant="outline">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button type="button" asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Error ID: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">ERR-500-A7K2</code>
        </p>
      </motion.div>
    </div>
  );
}
