import {
  InvoiceStatus,
  PaymentStatus,
  type Appointment,
  type DashboardActivityRow,
  type DashboardAppointmentRow,
  type DashboardMoney,
  type DashboardRevenuePoint,
  type DashboardRevenueRange,
  type DashboardSummary,
  type DashboardSummaryResponse,
  type DashboardRevenueResponse,
} from "@aba/shared";
import {
  addMoneyAmounts,
  filsToMoney,
  moneyToFils,
  formatRelativeTime,
  formatTimeInTimezone,
  getDatePartsInTimezone,
  getDayBoundsInTimezone,
  getZonedYmd,
  addDaysToYmd,
  subtractMoney,
  zonedDayStartUtc,
} from "@aba/shared";
import { businessRepository } from "../../../repositories/business.repository.js";
import { customerRepository } from "../../../repositories/customer.repository.js";
import { appointmentRepository } from "../../../repositories/appointment.repository.js";
import { invoiceRepository } from "../../../repositories/invoice.repository.js";
import { paymentRepository } from "../../../repositories/payment.repository.js";
import { serviceRepository } from "../../../repositories/catalog.repository.js";
import { auditLogRepository } from "../../../repositories/ops.repository.js";
import { userRepository } from "../../../repositories/user.repository.js";
import { createLogger } from "../../../lib/logger.js";
import { getEnv } from "../../../config/env.js";

const logger = createLogger(getEnv());

async function safeTask(label: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    logger.warn(`Dashboard partial failure: ${label}`, {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export type DashboardAccess = {
  canViewFinancials: boolean;
  canViewCustomers: boolean;
  canViewAppointments: boolean;
  canViewInvoices: boolean;
  canViewActivity: boolean;
};

const ACTIVITY_LABELS: Record<string, string> = {
  "business.created": "Business created",
  "membership.role_changed": "Team role updated",
  "membership.suspended": "Team member suspended",
  "membership.removed": "Team member removed",
  "membership.reactivated": "Team member reactivated",
};

function money(amount: number, currency: string): DashboardMoney {
  return { amount: filsToMoney(moneyToFils(amount)), currency };
}

/** Revenue = sum of completed payments (recognized cash). */
async function sumCompletedRevenue(
  tenantId: string,
  startIso: string,
  endIso: string
): Promise<number> {
  const payments = await paymentRepository.listCompletedInRange(tenantId, startIso, endIso, 1000);
  return addMoneyAmounts(
    payments
      .filter((p) => p.status === PaymentStatus.COMPLETED)
      .map((p) => p.amount.amount)
  );
}

async function calculatePendingPayments(tenantId: string, currency: string): Promise<DashboardMoney> {
  const outstanding = await invoiceRepository.listOutstanding(tenantId, 200);
  let totalOutstanding = 0;

  for (const invoice of outstanding) {
    if (invoice.status === InvoiceStatus.VOID || invoice.status === InvoiceStatus.DRAFT) continue;
    const payments = await paymentRepository.listByInvoice(tenantId, invoice.id, 50);
    const paid = addMoneyAmounts(
      payments
        .filter((p) => p.status === PaymentStatus.COMPLETED)
        .map((p) => p.amount.amount)
    );
    const remaining = Math.max(0, subtractMoney(invoice.total.amount, paid));
    totalOutstanding = addMoneyAmounts([totalOutstanding, remaining]);
  }

  return money(totalOutstanding, currency);
}

async function resolveAppointmentRows(
  tenantId: string,
  appointments: Appointment[],
  timezone: string
): Promise<DashboardAppointmentRow[]> {
  const customerIds = [...new Set(appointments.map((a) => a.customerId))];
  const serviceIds = [...new Set(appointments.map((a) => a.serviceId).filter(Boolean))] as string[];
  const staffIds = [...new Set(appointments.map((a) => a.staffId).filter(Boolean))] as string[];

  const [customers, services] = await Promise.all([
    Promise.all(customerIds.map((id) => customerRepository.getById(tenantId, id))),
    Promise.all(serviceIds.map((id) => serviceRepository.getById(tenantId, id))),
  ]);

  const customerMap = new Map(
    customers.filter(Boolean).map((c) => [c!.id, c!.name || c!.fullName || "Customer"])
  );
  const serviceMap = new Map(services.filter(Boolean).map((s) => [s!.id, s!.name]));

  const staffMap = new Map<string, string>();
  await Promise.all(
    staffIds.map(async (id) => {
      const profile = await userRepository.getById(id);
      staffMap.set(id, profile?.displayName || "Team member");
    })
  );

  return appointments.map((appt) => ({
    id: appt.id,
    customerName: customerMap.get(appt.customerId) ?? "Unknown customer",
    serviceName: appt.serviceId
      ? (serviceMap.get(appt.serviceId) ?? appt.title)
      : appt.title,
    staffName: appt.staffId ? (staffMap.get(appt.staffId) ?? "Team member") : "Unassigned",
    time: formatTimeInTimezone(appt.startsAt, timezone),
    startsAt: appt.startsAt,
    status: appt.status,
  }));
}

function mapActivity(log: {
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  actorUserId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}): DashboardActivityRow {
  const title = ACTIVITY_LABELS[log.action] ?? log.action.replace(/[._]/g, " ");
  return {
    id: log.id,
    type: log.action,
    title,
    description: log.resourceType ? `${log.resourceType}${log.resourceId ? ` · ${log.resourceId}` : ""}` : undefined,
    actorUserId: log.actorUserId,
    resourceType: log.resourceType,
    resourceId: log.resourceId,
    createdAt: log.createdAt,
    relativeTime: log.createdAt ? formatRelativeTime(String(log.createdAt)) : undefined,
  };
}

export async function getDashboardSummary(
  tenantId: string,
  access: DashboardAccess
): Promise<DashboardSummaryResponse> {
  const business = await businessRepository.getById(tenantId);
  if (!business) {
    throw new Error("tenant not found");
  }

  const timezone = business.timezone || "Asia/Kuwait";
  const currency = business.currency || "KWD";
  const todayBounds = getDayBoundsInTimezone(timezone);

  const summary: DashboardSummary = {
    revenue: null,
    customers: null,
    appointmentsToday: null,
    invoices: null,
    pendingPayments: null,
  };

  let todayAppointments: DashboardAppointmentRow[] = [];
  let recentActivity: DashboardActivityRow[] = [];

  const tasks: Promise<void>[] = [];

  if (access.canViewFinancials) {
    tasks.push(
      safeTask("financials", async () => {
        const amount = await sumCompletedRevenue(tenantId, todayBounds.start, todayBounds.end);
        summary.revenue = money(amount, currency);
        summary.pendingPayments = await calculatePendingPayments(tenantId, currency);
      })
    );
  }

  if (access.canViewCustomers) {
    tasks.push(
      safeTask("customers", async () => {
        summary.customers = await customerRepository.countActive(tenantId);
      })
    );
  }

  if (access.canViewAppointments) {
    tasks.push(
      safeTask("appointments", async () => {
        const appts = await appointmentRepository.listByDateRange(
          tenantId,
          todayBounds.start,
          todayBounds.end,
          50
        );
        summary.appointmentsToday = appts.length;
        todayAppointments = await resolveAppointmentRows(tenantId, appts, timezone);
      })
    );
  }

  if (access.canViewInvoices) {
    tasks.push(
      safeTask("invoices", async () => {
        summary.invoices = await invoiceRepository.countActive(tenantId);
      })
    );
  }

  if (access.canViewActivity) {
    tasks.push(
      safeTask("activity", async () => {
        const logs = await auditLogRepository.list(tenantId, 15);
        recentActivity = logs.map(mapActivity);
      })
    );
  }

  await Promise.all(tasks);

  return {
    tenantId,
    timezone,
    currency,
    businessName: business.name,
    summary,
    todayAppointments,
    recentActivity,
  };
}

function rangeBounds(
  range: DashboardRevenueRange,
  timezone: string,
  now = new Date()
): { start: string; end: string } {
  const todayYmd = getZonedYmd(timezone, now);
  const { end } = getDayBoundsInTimezone(timezone, now);

  if (range === "today") {
    const { start } = getDayBoundsInTimezone(timezone, now);
    return { start, end };
  }
  if (range === "7d") {
    const startYmd = addDaysToYmd(todayYmd, -6);
    return { start: zonedDayStartUtc(timezone, startYmd).toISOString(), end };
  }
  if (range === "30d") {
    const startYmd = addDaysToYmd(todayYmd, -29);
    return { start: zonedDayStartUtc(timezone, startYmd).toISOString(), end };
  }

  const parts = getDatePartsInTimezone(timezone, now);
  let year = parts.year;
  let month = parts.month - 11;
  while (month <= 0) {
    month += 12;
    year -= 1;
  }
  const startYmd = `${year}-${String(month).padStart(2, "0")}-01`;
  return { start: zonedDayStartUtc(timezone, startYmd).toISOString(), end };
}

function bucketKeyForPayment(
  paidAt: string,
  range: DashboardRevenueRange,
  timezone: string
): string {
  const date = new Date(paidAt);
  const parts = getDatePartsInTimezone(timezone, date);
  if (range === "today") {
    return `${String(parts.hour).padStart(2, "0")}:00`;
  }
  if (range === "12m") {
    return `${parts.year}-${String(parts.month).padStart(2, "0")}`;
  }
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function buildBucketLabels(
  range: DashboardRevenueRange,
  timezone: string,
  now = new Date()
): { key: string; label: string }[] {
  const todayYmd = getZonedYmd(timezone, now);
  if (range === "today") {
    return Array.from({ length: 24 }, (_, h) => ({
      key: `${String(h).padStart(2, "0")}:00`,
      label: `${String(h).padStart(2, "0")}:00`,
    }));
  }
  if (range === "7d") {
    return Array.from({ length: 7 }, (_, i) => {
      const ymd = addDaysToYmd(todayYmd, i - 6);
      const d = new Date(`${ymd}T12:00:00.000Z`);
      const label = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(d);
      return { key: ymd, label };
    });
  }
  if (range === "30d") {
    return Array.from({ length: 30 }, (_, i) => {
      const ymd = addDaysToYmd(todayYmd, i - 29);
      const d = new Date(`${ymd}T12:00:00.000Z`);
      const label = new Intl.DateTimeFormat("en-US", { timeZone: timezone, day: "numeric", month: "short" }).format(d);
      return { key: ymd, label };
    });
  }
  const buckets: { key: string; label: string }[] = [];
  const parts = getDatePartsInTimezone(timezone, now);
  for (let i = 11; i >= 0; i--) {
    const month = parts.month - i;
    const year = parts.year + Math.floor((month - 1) / 12);
    const normalizedMonth = ((month - 1 + 12) % 12) + 1;
    const key = `${year}-${String(normalizedMonth).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "short",
      year: "2-digit",
    }).format(new Date(Date.UTC(year, normalizedMonth - 1, 1)));
    buckets.push({ key, label });
  }
  return buckets;
}

export async function getDashboardRevenue(
  tenantId: string,
  range: DashboardRevenueRange
): Promise<DashboardRevenueResponse> {
  const business = await businessRepository.getById(tenantId);
  if (!business) throw new Error("tenant not found");

  const timezone = business.timezone || "Asia/Kuwait";
  const currency = business.currency || "KWD";
  const { start, end } = rangeBounds(range, timezone);

  const payments = await paymentRepository.listCompletedInRange(tenantId, start, end, 2000);
  const buckets = buildBucketLabels(range, timezone);
  const totals = new Map(buckets.map((b) => [b.key, 0]));

  for (const payment of payments) {
    if (!payment.paidAt || payment.status !== PaymentStatus.COMPLETED) continue;
    const key =
      range === "today"
        ? bucketKeyForPayment(payment.paidAt, range, timezone)
        : range === "12m"
          ? bucketKeyForPayment(payment.paidAt, range, timezone)
          : getZonedYmd(timezone, new Date(payment.paidAt));
    if (totals.has(key)) {
      totals.set(key, addMoneyAmounts([totals.get(key)!, payment.amount.amount]));
    }
  }

  const points: DashboardRevenuePoint[] = buckets.map((b) => ({
    key: b.key,
    label: b.label,
    revenue: totals.get(b.key) ?? 0,
    currency,
  }));

  const total = addMoneyAmounts(points.map((p) => p.revenue));

  return {
    tenantId,
    range,
    timezone,
    currency,
    total: money(total, currency),
    points,
  };
}

export function parseRevenueRange(value: unknown): DashboardRevenueRange | null {
  if (value === "today" || value === "7d" || value === "30d" || value === "12m") return value;
  return null;
}
