export type DashboardRevenueRange = "today" | "7d" | "30d" | "12m";

export type DashboardMoney = {
  amount: number;
  currency: string;
};

export type DashboardSummary = {
  revenue: DashboardMoney | null;
  customers: number | null;
  appointmentsToday: number | null;
  invoices: number | null;
  pendingPayments: DashboardMoney | null;
};

export type DashboardAppointmentRow = {
  id: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  time: string;
  startsAt: string;
  status: string;
};

export type DashboardActivityRow = {
  id: string;
  type: string;
  title: string;
  description?: string;
  actorUserId?: string;
  resourceType: string;
  resourceId?: string;
  createdAt: string;
  relativeTime?: string;
};

export type DashboardRevenuePoint = {
  label: string;
  key: string;
  revenue: number;
  currency: string;
};

export type DashboardSummaryResponse = {
  tenantId: string;
  timezone: string;
  currency: string;
  businessName: string;
  summary: DashboardSummary;
  todayAppointments: DashboardAppointmentRow[];
  recentActivity: DashboardActivityRow[];
};

export type DashboardRevenueResponse = {
  tenantId: string;
  range: DashboardRevenueRange;
  timezone: string;
  currency: string;
  total: DashboardMoney;
  points: DashboardRevenuePoint[];
};
