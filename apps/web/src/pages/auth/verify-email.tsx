import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { abaMotion } from "@/design-system/motion/tokens";

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-emerald-50/50 p-6 dark:from-emerald-950/30 dark:via-background dark:to-emerald-950/20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-800/20" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-700/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: abaMotion.duration.slow }}
        className="relative w-full max-w-md"
      >
        <Card className="overflow-hidden border-0 shadow-[0_8px_40px_rgba(15,23,42,0.12)]">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-10 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <Mail className="h-10 w-10" />
            </motion.div>
            <h1 className="mt-6 text-2xl font-semibold">Verify your email</h1>
            <p className="mt-2 text-sm text-emerald-100">One more step to activate your account</p>
          </div>

          <CardContent className="space-y-6 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">sara@noor.kw</span>. Click the link in the email to
              verify your account.
            </p>

            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="text-xs text-muted-foreground">
                Link expires in <strong className="text-foreground">24 hours</strong>
              </p>
            </div>

            <div className="space-y-3">
              <Button type="button" className="w-full">
                Open email app
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4" />
                Resend verification email
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Wrong email?{" "}
              <Link to="/register" className="font-medium text-emerald-600 hover:underline">
                Update registration
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
