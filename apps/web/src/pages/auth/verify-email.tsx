import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/app/providers/auth-provider";
import { abaMotion } from "@/design-system/motion/tokens";

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, reloadUser, signOut, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [resent, setResent] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const autoSent = useRef(false);

  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Auto-send once when landing on this page (covers failed send during signup).
  useEffect(() => {
    if (!user || user.emailVerified || autoSent.current) return;
    autoSent.current = true;
    void (async () => {
      clearError();
      setPending(true);
      try {
        await sendVerificationEmail();
        setResent(true);
        setInfo("Verification email sent. Check inbox and Spam/Promotions.");
      } catch {
        setInfo(null);
      } finally {
        setPending(false);
      }
    })();
  }, [user, sendVerificationEmail, clearError]);

  async function resend() {
    clearError();
    setInfo(null);
    setPending(true);
    try {
      await sendVerificationEmail();
      setResent(true);
      setInfo("Verification email resent. Check Spam/Promotions if you do not see it.");
    } catch {
      // context error
    } finally {
      setPending(false);
    }
  }

  async function checkVerified() {
    clearError();
    setPending(true);
    try {
      const refreshed = await reloadUser();
      if (refreshed?.emailVerified) {
        navigate("/app/dashboard", { replace: true });
      } else {
        setInfo("Still not verified. Open the link in the email, then try again.");
      }
    } catch {
      // context
    } finally {
      setPending(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md p-8 text-center">
          <p className="text-sm text-muted-foreground">Sign in to verify your email.</p>
          <Button className="mt-4" asChild>
            <Link to="/login">Go to sign in</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-emerald-50/50 p-6 dark:from-emerald-950/30 dark:via-background dark:to-emerald-950/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: abaMotion.duration.slow }}
        className="relative w-full max-w-md"
      >
        <Card className="overflow-hidden border-0 shadow-[0_8px_40px_rgba(15,23,42,0.12)]">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-10 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Mail className="h-10 w-10" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold">Verify your email</h1>
            <p className="mt-2 text-sm text-emerald-100">One more step to activate your account</p>
          </div>

          <CardContent className="space-y-6 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              We send a verification link to{" "}
              <span className="font-medium text-foreground">{user.email}</span>.
            </p>
            <p className="text-xs text-muted-foreground">
              From: <code className="rounded bg-muted px-1">noreply@…firebaseapp.com</code> — check{" "}
              <strong>Spam</strong> and <strong>Promotions</strong>.
            </p>

            {info ? <p className="text-sm text-emerald-600">{info}</p> : null}
            {resent && !info ? (
              <p className="text-sm text-emerald-600">Verification email sent.</p>
            ) : null}
            {error ? <p className="text-sm text-destructive">{error.message}</p> : null}

            <div className="space-y-3">
              <Button
                type="button"
                className="w-full"
                disabled={pending}
                onClick={() => void checkVerified()}
              >
                I verified — continue
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={pending}
                onClick={() => void resend()}
              >
                <RefreshCw className="h-4 w-4" />
                {pending ? "Sending…" : "Resend verification email"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => void signOut().then(() => navigate("/login"))}
              >
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
