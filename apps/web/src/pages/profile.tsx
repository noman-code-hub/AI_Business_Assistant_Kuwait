import { useState, type FormEvent } from "react";
import { Mail, Shield, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/app/providers/auth-provider";
import { useTenant } from "@/app/providers/tenant-provider";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/services/firestore";

export default function ProfilePage() {
  const { user, firebaseUser, reloadUser, getIdToken, error, clearError } = useAuth();
  const { tenant, membershipRole, profile, refresh } = useTenant();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [tokenPreview, setTokenPreview] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    clearError();
    setSaving(true);
    setSaveMsg(null);
    try {
      await updateProfile(firebaseUser, { displayName: displayName.trim() });
      await setDoc(
        doc(db, Collections.users, firebaseUser.uid),
        {
          displayName: displayName.trim(),
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      await reloadUser();
      await refresh();
      setSaveMsg("Profile saved.");
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function showToken() {
    const token = await getIdToken(true);
    setTokenPreview(token ? `${token.slice(0, 24)}… (${token.length} chars)` : null);
  }

  const name = user?.displayName ?? user?.email ?? "User";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Profile" description="Your account and session." />

      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
          <Avatar name={name} src={user?.photoURL ?? undefined} className="h-24 w-24 text-xl" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-muted-foreground">
              {membershipRole ?? "member"} · {tenant?.name ?? "Workspace"}
            </p>
            <Badge variant={user?.emailVerified ? "success" : "warning"} className="mt-3">
              {user?.emailVerified ? "Email verified" : "Email not verified"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Personal information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => void onSave(e)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" value={user?.email ?? ""} disabled />
                </div>
              </div>
            </div>
            {saveMsg ? <p className="text-sm text-muted-foreground">{saveMsg}</p> : null}
            {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Session
          </CardTitle>
          <CardDescription>
            Firebase Auth persistence keeps you signed in. Use the ID token for API calls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">UID:</span> {user?.uid}
          </p>
          <p>
            <span className="text-muted-foreground">Locale (profile):</span> {profile?.locale ?? "en"}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => void showToken()}>
            Refresh ID token
          </Button>
          {tokenPreview ? <p className="break-all font-mono text-xs text-muted-foreground">{tokenPreview}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
