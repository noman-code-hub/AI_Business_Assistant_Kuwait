import {
  GoogleAuthProvider,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getRedirectResult,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  verifyPasswordResetCode,
  type ActionCodeSettings,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export type AuthErrorInfo = {
  code: string;
  message: string;
};

export function mapAuthError(error: unknown): AuthErrorInfo {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code: string }).code);
    const message =
      "message" in error ? String((error as { message: string }).message) : "Authentication failed";

    const messages: Record<string, string> = {
      "auth/popup-closed-by-user": "Sign-in was cancelled.",
      "auth/popup-blocked": "Pop-up was blocked. Allow pop-ups and try again.",
      "auth/cancelled-popup-request": "Another sign-in is already in progress.",
      "auth/account-exists-with-different-credential":
        "An account already exists with the same email using a different sign-in method.",
      "auth/network-request-failed": "Network error. Check your connection and try again.",
      "auth/unauthorized-domain":
        "This domain is not authorized for Google sign-in in Firebase Console.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/requires-recent-login": "Please sign in again to continue.",
      "auth/expired-action-code": "This link has expired. Request a new one.",
      "auth/invalid-action-code": "This link is invalid or already used.",
      "auth/missing-password": "Password is required.",
      "auth/unauthorized-continue-uri":
        "Continue URL is not allowed. Add localhost to Firebase Authorized domains.",
      "auth/invalid-continue-uri": "Invalid continue URL for the verification email.",
    };

    return { code, message: messages[code] ?? message };
  }

  return { code: "auth/unknown", message: "Authentication failed." };
}

function actionCodeSettings(): ActionCodeSettings {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  return {
    url: `${origin}/auth/action`,
    handleCodeInApp: false,
  };
}

/** Send verification; fall back to default Firebase handler if continue URL is rejected. */
async function sendVerificationEmailSafe(user: User): Promise<void> {
  try {
    await sendEmailVerification(user, actionCodeSettings());
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";
    if (code === "auth/unauthorized-continue-uri" || code === "auth/invalid-continue-uri") {
      await sendEmailVerification(user);
      return;
    }
    throw error;
  }
}

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
  if (input.displayName?.trim()) {
    await updateProfile(credential.user, { displayName: input.displayName.trim() });
  }
  try {
    await sendVerificationEmailSafe(credential.user);
  } catch {
    // Account exists; user can resend from /verify-email
  }
  return credential;
}

export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signInWithGoogle(): Promise<UserCredential | null> {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";

    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
}

export async function completeGoogleRedirect(): Promise<UserCredential | null> {
  return getRedirectResult(auth);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings());
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";
    if (code === "auth/unauthorized-continue-uri" || code === "auth/invalid-continue-uri") {
      await sendPasswordResetEmail(auth, email.trim());
      return;
    }
    throw error;
  }
}

export async function verifyResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(auth, oobCode);
}

export async function resetPassword(oobCode: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function sendVerificationEmail(user: User = auth.currentUser!): Promise<void> {
  if (!user) throw Object.assign(new Error("Not signed in"), { code: "auth/unknown" });
  if (user.emailVerified) return;
  await sendVerificationEmailSafe(user);
}

export async function applyEmailActionCode(oobCode: string): Promise<void> {
  await applyActionCode(auth, oobCode);
}

export async function reloadCurrentUser(): Promise<User | null> {
  if (!auth.currentUser) return null;
  await reload(auth.currentUser);
  return auth.currentUser;
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export function toAuthUser(user: User) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

export type { User, UserCredential };
