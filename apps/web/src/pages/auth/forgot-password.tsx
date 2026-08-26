import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { abaMotion } from "@/design-system/motion/tokens";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-emerald-50/20 to-background p-6 dark:via-emerald-950/10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: abaMotion.duration.normal }}
        className="w-full max-w-md"
      >
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <Card className="shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <CardTitle className="text-lg">Reset password</CardTitle>
                  <CardDescription>We&apos;ll email you instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="email" placeholder="you@business.com" className="pl-10" defaultValue="sara@noor.kw" />
                      </div>
                    </div>
                    <Button type="button" className="w-full" onClick={() => setSent(true)}>
                      Send reset link
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <Card className="text-center shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                <CardContent className="py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 text-xl font-semibold">Check your email</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We sent a password reset link to <strong>sara@noor.kw</strong>
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Didn&apos;t receive it? Check spam or try again in a few minutes.
                  </p>
                  <div className="mt-8 flex flex-col gap-2">
                    <Button type="button" variant="outline" onClick={() => setSent(false)}>
                      Try another email
                    </Button>
                    <Button type="button" variant="accent" asChild>
                      <Link to="/login">Return to sign in</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
