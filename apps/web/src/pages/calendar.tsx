import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, LayoutGrid, Columns, List } from "lucide-react";
import { appointments } from "@/data/dummy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "week" | "agenda";

const EVENT_COLORS = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

const calendarEvents = appointments.map((apt, i) => ({
  ...apt,
  color: EVENT_COLORS[i % EVENT_COLORS.length],
  day: apt.date === "Today" ? 23 : apt.date === "Tomorrow" ? 24 : 20 + i,
}));

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_DAYS = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2;
  return day < 1 || day > 31 ? null : day;
});

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState(23);

  const eventsForDay = useMemo(
    () => calendarEvents.filter((e) => e.day === selectedDay),
    [selectedDay]
  );

  const upcoming = calendarEvents.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Month, week, and agenda views synced with appointments."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Create event
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="min-w-[140px] text-center text-lg font-semibold">July 2026</h2>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex rounded-2xl bg-muted p-1">
                {(
                  [
                    ["month", "Month", LayoutGrid],
                    ["week", "Week", Columns],
                    ["agenda", "Agenda", List],
                  ] as const
                ).map(([mode, label, Icon]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setView(mode)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                      view === mode
                        ? "bg-card text-emerald-700 shadow-sm dark:text-emerald-300"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6">
              {view === "month" && (
                <>
                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                    {WEEK_DAYS.map((d) => (
                      <div key={d} className="py-2">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {MONTH_DAYS.map((day, i) => {
                      if (day === null) return <div key={`empty-${i}`} className="min-h-[88px]" />;
                      const dayEvents = calendarEvents.filter((e) => e.day === day);
                      const isSelected = day === selectedDay;
                      const isToday = day === 23;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={cn(
                            "min-h-[88px] rounded-2xl border p-2 text-start transition-all hover:shadow-sm",
                            isSelected
                              ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40"
                              : "border-border/60 bg-card",
                            isToday && !isSelected && "ring-1 ring-emerald-500/40"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                              isToday && "bg-emerald-600 font-semibold text-white"
                            )}
                          >
                            {day}
                          </span>
                          <div className="mt-1 space-y-0.5">
                            {dayEvents.slice(0, 2).map((ev) => (
                              <div
                                key={ev.id}
                                className={cn("truncate rounded px-1 py-0.5 text-[10px] text-white", ev.color)}
                              >
                                {ev.time} {ev.service}
                              </div>
                            ))}
                            {dayEvents.length > 2 ? (
                              <p className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</p>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {view === "week" && (
                <div className="overflow-x-auto">
                  <div className="grid min-w-[640px] grid-cols-8 gap-px rounded-2xl border border-border bg-border">
                    <div className="bg-card p-2" />
                    {WEEK_DAYS.map((d, i) => (
                      <div
                        key={d}
                        className={cn(
                          "bg-card p-2 text-center text-sm font-medium",
                          i === 3 && "text-emerald-600"
                        )}
                      >
                        {d}
                        <div className={cn("mt-1 text-xs", i === 3 ? "font-bold" : "text-muted-foreground")}>
                          {20 + i}
                        </div>
                      </div>
                    ))}
                    {["08:00", "10:00", "12:00", "14:00", "16:00"].map((hour) => (
                      <Fragment key={hour}>
                        <div className="bg-card p-2 text-xs text-muted-foreground">{hour}</div>
                        {WEEK_DAYS.map((_, col) => {
                          const ev = col === 3 ? calendarEvents.find((e) => e.time.startsWith(hour.slice(0, 2))) : null;
                          return (
                            <div key={`${hour}-${col}`} className="min-h-[56px] bg-card p-1">
                              {ev ? (
                                <div className={cn("rounded-lg px-2 py-1 text-[10px] text-white", ev.color)}>
                                  {ev.service}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </Fragment>
                    ))}
                  </div>
                </div>
              )}

              {view === "agenda" && (
                <div className="space-y-3">
                  {calendarEvents.map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-4 rounded-2xl border border-border p-4"
                    >
                      <div className={cn("w-1 shrink-0 rounded-full", ev.color)} />
                      <div className="flex-1">
                        <p className="font-medium">{ev.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {ev.customer} · {ev.staff}
                        </p>
                      </div>
                      <div className="text-end text-sm">
                        <p className="font-medium">Jul {ev.day}</p>
                        <p className="text-muted-foreground">{ev.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mini calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
                {WEEK_DAYS.map((d) => (
                  <span key={d}>{d[0]}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {MONTH_DAYS.map((day, i) =>
                  day === null ? (
                    <span key={`m-${i}`} />
                  ) : (
                    <button
                      key={`m-${day}`}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "aspect-square rounded-lg text-xs transition-colors",
                        day === selectedDay
                          ? "bg-emerald-600 font-semibold text-white"
                          : day === 23
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                            : "hover:bg-muted"
                      )}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jul {selectedDay} events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {eventsForDay.length ? (
                eventsForDay.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-2 rounded-xl border border-border p-3 text-sm">
                    <div className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", ev.color)} />
                    <div>
                      <p className="font-medium">{ev.service}</p>
                      <p className="text-xs text-muted-foreground">
                        {ev.time} · {ev.customer}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No events this day.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3">
                  <div className={cn("h-10 w-1 rounded-full", ev.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ev.service}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ev.date} {ev.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {ev.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
