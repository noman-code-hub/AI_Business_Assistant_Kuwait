import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  applyEmailActionCode,
  completeGoogleRedirect,
  getIdToken,
  mapAuthError,
  reloadCurrentUser,
  resetPassword,
  sendPasswordReset,
  sendVerificationEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  toAuthUser,
  verifyResetCode,
  type AuthErrorInfo,
} from "@/services/auth/auth.service";

export type AuthUser = ReturnType<typeof toAuthUser>;

type AuthContextValue = {
  user: AuthUser | null;
  firebaseUser: User | null;
  loading: boolean;
  error: AuthErrorInfo | null;
  signUpWithEmail: (input: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<AuthUser>;
  signInWithEmail: (email: string, password: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  verifyResetCode: (oobCode: string) => Promise<string>;
  resetPassword: (oobCode: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  applyEmailActionCode: (oobCode: string) => Promise<void>;
  reloadUser: () => Promise<AuthUser | null>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthErrorInfo | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        await completeGoogleRedirect();
      } catch (err) {
        if (active) setError(mapAuthError(err));
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!active) return;
      setFirebaseUser(nextUser);
      setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const mapped = mapAuthError(err);
      setError(mapped);
      throw mapped;
    }
  }, []);

  const handleSignUp = useCallback(
    async (input: { email: string; password: string; displayName?: string }) =>
      wrap(async () => toAuthUser((await signUpWithEmail(input)).user)),
    [wrap]
  );

  const handleEmailSignIn = useCallback(
    async (email: string, password: string) =>
      wrap(async () => toAuthUser((await signInWithEmail(email, password)).user)),
    [wrap]
  );

  const handleGoogleSignIn = useCallback(
    async () =>
      wrap(async () => {
        const result = await signInWithGoogle();
        return result ? toAuthUser(result.user) : null;
      }),
    [wrap]
  );

  const handleSignOut = useCallback(async () => wrap(async () => signOutUser()), [wrap]);

  const handleSendPasswordReset = useCallback(
    async (email: string) => wrap(async () => sendPasswordReset(email)),
    [wrap]
  );

  const handleVerifyResetCode = useCallback(
    async (oobCode: string) => wrap(async () => verifyResetCode(oobCode)),
    [wrap]
  );

  const handleResetPassword = useCallback(
    async (oobCode: string, newPassword: string) =>
      wrap(async () => resetPassword(oobCode, newPassword)),
    [wrap]
  );

  const handleSendVerification = useCallback(
    async () =>
      wrap(async () => {
        if (!auth.currentUser) throw { code: "auth/unknown", message: "Not signed in" };
        await sendVerificationEmail(auth.currentUser);
      }),
    [wrap]
  );

  const handleApplyActionCode = useCallback(
    async (oobCode: string) => wrap(async () => applyEmailActionCode(oobCode)),
    [wrap]
  );

  const handleReloadUser = useCallback(
    async () =>
      wrap(async () => {
        const user = await reloadCurrentUser();
        if (user) setFirebaseUser(user);
        return user ? toAuthUser(user) : null;
      }),
    [wrap]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: firebaseUser ? toAuthUser(firebaseUser) : null,
      firebaseUser,
      loading,
      error,
      signUpWithEmail: handleSignUp,
      signInWithEmail: handleEmailSignIn,
      signInWithGoogle: handleGoogleSignIn,
      signOut: handleSignOut,
      sendPasswordReset: handleSendPasswordReset,
      verifyResetCode: handleVerifyResetCode,
      resetPassword: handleResetPassword,
      sendVerificationEmail: handleSendVerification,
      applyEmailActionCode: handleApplyActionCode,
      reloadUser: handleReloadUser,
      getIdToken,
      clearError: () => setError(null),
    }),
    [
      firebaseUser,
      loading,
      error,
      handleSignUp,
      handleEmailSignIn,
      handleGoogleSignIn,
      handleSignOut,
      handleSendPasswordReset,
      handleVerifyResetCode,
      handleResetPassword,
      handleSendVerification,
      handleApplyActionCode,
      handleReloadUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
