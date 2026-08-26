import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  CreditCard,
  Globe,
  Key,
  Lock,
  Palette,
  Receipt,
  Save,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { business } from "@/data/dummy";
import { cn } from "@/lib/utils";

const sections = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "branding", label: "Branding", icon: Sparkles },
  { id: "language", label: "Language", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "team", label: "Team", icon: Users },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function SettingsPage() {
  const [active, setActive] = useState<SectionId>("company");

  return (
    <div className="relative pb-24">
      <PageHeader title="Settings" description="Manage your business preferences and account." />

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav className="lg:w-56 lg:shrink-0">
          <div className="sticky top-4 space-y-1 rounded-2xl border border-border/80 bg-card p-2 shadow-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active === section.id
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon className="h-4 w-4 shrink-0" />
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 flex-1 space-y-6"
        >
          {active === "company" && (
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
                <CardDescription>Basic business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business name</label>
                    <Input defaultValue={business.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Owner</label>
                    <Input defaultValue={business.owner} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vertical</label>
                    <Input defaultValue={business.vertical} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input defaultValue={business.city} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "branding" && (
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Logo, colors, and invoice prefix</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 text-sm text-muted-foreground">
                  Upload logo
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary color</label>
                    <Input defaultValue="#059669" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice prefix</label>
                    <Input defaultValue="INV-" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "language" && (
            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>Default language and RTL support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default language</label>
                    <Input defaultValue="English" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary language</label>
                    <Input defaultValue="Arabic" />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border/80 p-4">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-emerald-600" />
                  <span className="text-sm">Enable RTL layout for Arabic</span>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Email and in-app alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["New messages", "Appointment reminders", "Invoice updates", "AI suggestions"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-border/80 p-4">
                    <span className="text-sm font-medium">{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-emerald-600" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {active === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Password and two-factor authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current password</label>
                  <Input type="password" defaultValue="••••••••" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/80 p-4">
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "subscription" && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Your current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <Badge>Professional</Badge>
                  <p className="mt-3 text-2xl font-semibold">29 KWD / month</p>
                  <p className="mt-1 text-sm text-muted-foreground">Renews on 15 Aug 2026</p>
                  <Button type="button" variant="outline" className="mt-4">
                    Manage plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Payment method and billing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-border/80 p-4">
                  <CreditCard className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 09/28</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Billing email</label>
                  <Input defaultValue="billing@noor.kw" />
                </div>
              </CardContent>
            </Card>
          )}

          {active === "api-keys" && (
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage access tokens for integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-border/80 p-4">
                  <div>
                    <p className="font-medium">Production key</p>
                    <p className="font-mono text-xs text-muted-foreground">aba_live_••••••••••••••••</p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Lock className="h-3.5 w-3.5" />
                    Reveal
                  </Button>
                </div>
                <Button type="button" variant="accent">
                  Generate new key
                </Button>
              </CardContent>
            </Card>
          )}

          {active === "team" && (
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Default roles and invitations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default role for new members</label>
                  <Input defaultValue="Staff" />
                </div>
                <Textarea placeholder="Invitation message template..." defaultValue="Join our team on Noor Wellness Kuwait." />
              </CardContent>
            </Card>
          )}

          {active === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Theme and display preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {["Light", "Dark", "System"].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      className={cn(
                        "rounded-2xl border-2 p-4 text-sm font-medium transition-all",
                        theme === "Light"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-border hover:border-emerald-300"
                      )}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-card/95 px-4 py-4 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-md lg:left-64">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">You have unsaved changes</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline">
              Discard
            </Button>
            <Button type="button">
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
