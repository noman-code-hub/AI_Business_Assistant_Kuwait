import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { notifications } from "@/data/dummy";
import { cn } from "@/lib/utils";

const categories = ["All", "Messages", "Billing", "Appointments", "AI"] as const;

const categoryVariant: Record<string, "info" | "warning" | "success" | "default"> = {
  Messages: "info",
  Billing: "warning",
  Appointments: "success",
  AI: "default",
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchCategory = filter === "All" || n.category === filter;
      const matchSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase());
      const matchUnread = !showUnreadOnly || n.unread;
      return matchCategory && matchSearch && matchUnread;
    });
  }, [filter, search, showUnreadOnly]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Notifications"
        description="Stay on top of messages, billing, and AI updates."
        actions={
          <Button type="button" variant="outline">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant={showUnreadOnly ? "default" : "outline"}
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          <Filter className="h-4 w-4" />
          Unread ({unreadCount})
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            type="button"
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <Bell className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-medium">No notifications found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md",
                  n.unread && "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/20"
                )}
              >
                <CardContent className="flex gap-4 p-5">
                  <div
                    className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      n.unread ? "bg-emerald-500" : "bg-transparent"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className={cn("font-medium", n.unread && "text-foreground")}>{n.title}</p>
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <Badge variant={categoryVariant[n.category] ?? "secondary"} className="mt-3">
                      {n.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
