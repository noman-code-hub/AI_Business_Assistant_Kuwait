import { motion } from "framer-motion";
import { Bell, Globe, Lock, Mail, Shield, Smartphone, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { business } from "@/data/dummy";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title="Profile" description="Your personal account settings." />

      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
          <Avatar name={business.owner} className="h-24 w-24 text-xl" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{business.owner}</h2>
            <p className="text-muted-foreground">Owner · {business.name}</p>
            <Badge variant="success" className="mt-3">
              Verified
            </Badge>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button type="button" variant="outline" size="sm">
                Change photo
              </Button>
              <Button type="button" variant="accent" size="sm">
                Edit profile
              </Button>
            </div>
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
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full name</label>
              <Input defaultValue={business.owner} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="sara@noor.kw" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input defaultValue="+965 5000 1234" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job title</label>
              <Input defaultValue="Owner & CEO" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            Preferences
          </CardTitle>
          <CardDescription>Language, timezone, and display</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Input defaultValue="English (US)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Input defaultValue="Asia/Kuwait (GMT+3)" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/80 p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm">
              Update
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/80 p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Two-factor auth</p>
                <p className="text-xs text-muted-foreground">Authenticator app enabled</p>
              </div>
            </div>
            <Badge variant="success">On</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { icon: Mail, label: "Email digest", desc: "Weekly summary" },
            { icon: Bell, label: "Push notifications", desc: "Real-time alerts" },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between rounded-2xl border border-border/80 p-4"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-emerald-600" />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
