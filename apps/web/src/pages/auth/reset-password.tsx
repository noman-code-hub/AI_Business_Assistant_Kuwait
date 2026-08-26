import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/providers/auth-provider";
import { Spinner } from "@/components/feedback/spinner";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode") ?? "";
  const { verifyResetCode, resetPassword, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setChecking(false);
      setLocalError("Missing reset code. Open the link from your email.");
      return;
    }
    void (async () => {
      try {
        const accountEmail = await verifyResetCode(oobCode);
        setEmail(accountEmail);
      } catch {
        // context error
      } finally {
        setChecking(false);
      }
    })();
  }, [oobCode, verifyResetCode]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setLocalError(null);
    if (password !== confirm) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    setPending(true);
    try {
      await resetPassword(oobCode, password);
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch {
      // context
    } finally {
      setPending(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Validating reset link…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            {email ? (
              <>
                Resetting password for <strong>{email}</strong>
              </>
            ) : (
              "Enter your new password"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-sm text-emerald-600">Password updated. Redirecting to sign in…</p>
          ) : (
            <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
              <div className="space-y-2">
                <label className="text-sm font-medium">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-10"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              {localError || error ? (
                <p className="text-sm text-destructive">{localError ?? error?.message}</p>
              ) : null}
              <Button type="submit" className="w-full" disabled={pending || !oobCode}>
                {pending ? "Updating…" : "Update password"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" asChild>
                <Link to="/login">Back to sign in</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
