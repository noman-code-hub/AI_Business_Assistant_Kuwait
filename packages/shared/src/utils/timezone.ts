type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

/** YYYY-MM-DD in the given IANA timezone. */
export function getZonedYmd(timeZone: string, date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getDatePartsInTimezone(timeZone: string, date: Date): DateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour") === "24" ? "0" : get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

function ymdToNumber(parts: DateParts): number {
  return parts.year * 10_000 + parts.month * 100 + parts.day;
}

/** UTC instant when local calendar day starts at 00:00:00 in `timeZone`. */
export function zonedDayStartUtc(timeZone: string, ymd: string): Date {
  const parts = ymd.split("-").map((v) => Number(v));
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const target = y * 10_000 + m * 100 + d;
  let low = Date.UTC(y, m - 1, d - 1);
  let high = Date.UTC(y, m - 1, d + 1);

  for (let i = 0; i < 48; i++) {
    const mid = Math.floor((low + high) / 2);
    const parts = getDatePartsInTimezone(timeZone, new Date(mid));
    const dayNum = ymdToNumber(parts);
    const seconds = parts.hour * 3600 + parts.minute * 60 + parts.second;
    if (dayNum < target || (dayNum === target && seconds > 0)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return new Date(high);
}

/** Inclusive end of local calendar day (23:59:59.999). */
export function zonedDayEndUtc(timeZone: string, ymd: string): Date {
  const start = zonedDayStartUtc(timeZone, ymd);
  const next = new Date(start);
  next.setUTCDate(next.getUTCDate() + 1);
  next.setUTCMilliseconds(next.getUTCMilliseconds() - 1);
  return next;
}

export function getDayBoundsInTimezone(
  timeZone: string,
  date = new Date()
): { start: string; end: string; ymd: string } {
  const ymd = getZonedYmd(timeZone, date);
  return {
    ymd,
    start: zonedDayStartUtc(timeZone, ymd).toISOString(),
    end: zonedDayEndUtc(timeZone, ymd).toISOString(),
  };
}

export function addDaysToYmd(ymd: string, days: number): string {
  const parts = ymd.split("-").map((v) => Number(v));
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function formatTimeInTimezone(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string, now = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
