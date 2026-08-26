import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  XCircle,
  CalendarClock,
} from "lucide-react";
import { appointments } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Tab = "upcoming" | "completed" | "cancelled";

const todaySlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const extendedAppointments = [
  ...appointments,
  { id: "a6", customer: "Yousef Al-Rashid", service: "Fleet Vehicle Check", staff: "Dr. Nasser", time: "08:30", date: "Today", status: "Completed" },
  { id: "a7", customer: "Noura Saleh", service: "Spa Package", staff: "Huda", time: "13:00", date: "Yesterday", status: "Completed" },
  { id: "a8", customer: "QuickFix Home", service: "Consultation", staff: "Dr. Layla", time: "15:00", date: "12 Jul", status: "Cancelled" },
];

function statusBadge(status: string) {
  if (status === "Confirmed" || status === "Completed") return "success" as const;
  if (status === "Cancelled") return "danger" as const;
  if (status === "Pending") return "warning" as const;
  return "info" as const;
}

function tabFilter(tab: Tab) {
  if (tab === "upcoming") return (a: (typeof extendedAppointments)[number]) =>
    a.status !== "Completed" && a.status !== "Cancelled";
  if (tab === "completed") return (a: (typeof extendedAppointments)[number]) => a.status === "Completed";
  return (a: (typeof extendedAppointments)[number]) => a.status === "Cancelled";
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const todayAppointments = extendedAppointments.filter((a) => a.date === "Today");
  const listItems = extendedAppointments.filter(tabFilter(tab));

  const stats = {
    today: todayAppointments.length,
    confirmed: extendedAppointments.filter((a) => a.status === "Confirmed").length,
    pending: extendedAppointments.filter((a) => a.status === "Pending").length,
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Today's schedule, bookings, and clinic timeline."
        actions={
          <Button>
            <CalendarPlus className="h-4 w-4" />
            New booking
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value={String(stats.today)} change="+2 vs yesterday" icon={CalendarClock} />
        <StatCard label="Confirmed" value={String(stats.confirmed)} icon={CheckCircle2} />
        <StatCard label="Pending" value={String(stats.pending)} icon={Clock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-600" />
                Today&apos;s timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative max-h-[520px] overflow-y-auto p-4">
                {todaySlots.map((slot) => {
                  const apt = todayAppointments.find((a) => a.time === slot);
                  return (
                    <div key={slot} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex w-14 shrink-0 flex-col items-end pt-1">
                        <span className="text-xs font-medium text-muted-foreground">{slot}</span>
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute -start-[9px] top-2 h-3 w-3 rounded-full border-2 border-emerald-500 bg-card" />
                        <div className="absolute -start-px top-5 bottom-0 w-px bg-border last:hidden" />
                        {apt ? (
                          <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ms-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold">{apt.service}</p>
                                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <User className="h-3.5 w-3.5" />
                                  {apt.customer}
                                </p>
                                <p className="mt-0.5 text-sm text-muted-foreground">with {apt.staff}</p>
                              </div>
                              <Badge variant={statusBadge(apt.status)}>{apt.status}</Badge>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="ms-4 h-8 rounded-xl border border-dashed border-border/80" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex gap-1 rounded-2xl bg-muted p-1">
                {(
                  [
                    ["upcoming", "Upcoming", CalendarClock],
                    ["completed", "Completed", CheckCircle2],
                    ["cancelled", "Cancelled", XCircle],
                  ] as const
                ).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium transition-all sm:text-sm",
                      tab === key
                        ? "bg-card text-emerald-700 shadow-sm dark:text-emerald-300"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {listItems.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border/80 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{apt.customer}</p>
                      <p className="text-sm text-muted-foreground">{apt.service}</p>
                    </div>
                    <Badge variant={statusBadge(apt.status)}>{apt.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      {apt.date} · {apt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
                      {apt.staff}
                    </span>
                  </div>
                </motion.div>
              ))}
              {!listItems.length ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No appointments in this tab.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
