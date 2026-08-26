import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/auth-provider";
import { cn } from "@/lib/utils";

export function GoogleSignInButton({
  className,
  label = "Continue with Google",
}: {
  className?: string;
  label?: string;
}) {
  const { signInWithGoogle, error, clearError } = useAuth();
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== "/login"
      ? (location.state as { from: string }).from
      : "/app/dashboard";

  async function handleClick() {
    clearError();
    setPending(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate(user.emailVerified ? from : "/verify-email", { replace: true });
      }
      // If null, redirect sign-in is in progress.
    } catch {
      // Error surfaced via auth context
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={() => void handleClick()}
      >
        <Chrome className="h-4 w-4" />
        {pending ? "Signing in…" : label}
      </Button>
      {error ? <p className="text-center text-xs text-destructive">{error.message}</p> : null}
    </div>
  );
}
