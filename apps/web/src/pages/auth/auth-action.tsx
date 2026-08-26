import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/providers/auth-provider";
import { Spinner } from "@/components/feedback/spinner";

/**
 * Continue URL after Firebase's hosted action page
 * (keep Console Action URL as default __/auth/action).
 *
 * Also supports direct handling when ?mode=&oobCode= hit this route.
 */
export default function AuthActionPage() {
  const [params] = useSearchParams();
  const mode = params.get("mode");
  const oobCode = params.get("oobCode") ?? "";
  const navigate = useNavigate();
  const { applyEmailActionCode, reloadUser, user, error } = useAuth();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Finishing…");

  useEffect(() => {
    if (oobCode && mode === "resetPassword") {
      navigate(`/reset-password?oobCode=${encodeURIComponent(oobCode)}`, { replace: true });
      return;
    }

    if (oobCode && mode === "verifyEmail") {
      void (async () => {
        try {
          await applyEmailActionCode(oobCode);
          await reloadUser();
          setStatus("ok");
          setMessage("Email verified. You can continue to the app.");
        } catch {
          setStatus("error");
          setMessage("Could not verify email. The link may be expired or already used.");
        }
      })();
      return;
    }

    // Landed here as continueUrl after Firebase hosted handler finished.
    void (async () => {
      try {
        const refreshed = await reloadUser();
        if (refreshed?.emailVerified || user?.emailVerified) {
          setStatus("ok");
          setMessage("Email verified. You can continue to the app.");
          return;
        }
      } catch {
        // ignore — user may not be signed in yet
      }
      setStatus("ok");
      setMessage("Action completed. You can sign in to continue.");
    })();
  }, [mode, oobCode, navigate, applyEmailActionCode, reloadUser, user?.emailVerified]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Account action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "working" ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              {message}
            </div>
          ) : (
            <>
              <p className={status === "ok" ? "text-sm text-emerald-600" : "text-sm text-destructive"}>
                {error?.message ?? message}
              </p>
              <Button asChild>
                <Link to={user ? "/app/dashboard" : "/login"}>Continue</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
