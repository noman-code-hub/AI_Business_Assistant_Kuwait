import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/app/providers/auth-provider";
import { business } from "@/data/dummy";
import { abaMotion } from "@/design-system/motion/tokens";

export default function LoginPage() {
  const { signInWithEmail, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== "/login"
      ? (location.state as { from: string }).from
      : "/app/dashboard";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setPending(true);
    try {
      const user = await signInWithEmail(email, password);
      navigate(user.emailVerified ? from : "/verify-email", { replace: true });
    } catch {
      // surfaced via context
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: abaMotion.duration.slow }}
        className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 lg:flex lg:flex-col lg:justify-between lg:p-12"
      >
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white">
            A
          </div>
          <h1 className="mt-12 max-w-md text-4xl font-semibold tracking-tight text-white">
            Run your business smarter with AI
          </h1>
          <p className="mt-4 max-w-sm text-emerald-100">
            WhatsApp inbox, appointments, invoicing, and AI — built for Kuwait businesses.
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <p className="text-sm text-emerald-50">
            &ldquo;Noor Wellness cut response time by 60% in the first month.&rdquo;
          </p>
          <p className="mt-3 text-sm font-medium text-white">{business.owner}</p>
          <p className="text-xs text-emerald-200">{business.name}</p>
        </div>
      </motion.div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: abaMotion.duration.normal }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>

          <Card className="mt-8 border-0 shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sign in</CardTitle>
              <CardDescription>Email/password or Google</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <GoogleSignInButton label="Continue with Google" />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or email</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@business.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-emerald-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Signing in…" : "Sign in"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-emerald-600 hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
