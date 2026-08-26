import { motion } from "framer-motion";
import { Mail, MessageSquare, MoreHorizontal, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { team } from "@/data/dummy";
import { abaMotion } from "@/design-system/motion/tokens";
import { cn } from "@/lib/utils";

const statusVariant = {
  Online: "success",
  Away: "warning",
  Offline: "secondary",
} as const;

const activity = [
  { user: "Sara Al-Mutairi", action: "Approved quotation QT-220", time: "10 min ago" },
  { user: "Dr. Layla Hassan", action: "Completed appointment with Fatima", time: "25 min ago" },
  { user: "Huda Kamal", action: "Confirmed 3 bookings for Thursday", time: "1 hour ago" },
  { user: "Amina Faris", action: "Updated spa service pricing", time: "2 hours ago" },
  { user: "Nasser Ali", action: "Exported July revenue report", time: "Yesterday" },
];

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Manage staff roles, availability, and activity."
        actions={
          <Button type="button">
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {team.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: abaMotion.duration.normal }}
          >
            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar name={member.name} className="h-14 w-14 text-base" />
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card",
                          member.status === "Online" && "bg-emerald-500",
                          member.status === "Away" && "bg-amber-400",
                          member.status === "Offline" && "bg-slate-300 dark:bg-slate-600"
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <Badge variant={statusVariant[member.status as keyof typeof statusVariant]} className="mt-2">
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  {member.email}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message
                  </Button>
                  <Button type="button" variant="accent" size="sm" className="flex-1">
                    View profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {activity.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {idx < activity.length - 1 && (
                  <div className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-px bg-border" />
                )}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                  <Avatar name={item.user} className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-sm">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
