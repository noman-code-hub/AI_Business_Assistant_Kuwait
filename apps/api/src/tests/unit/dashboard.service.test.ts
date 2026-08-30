import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  InvoiceStatus,
  PaymentStatus,
  type Appointment,
  type Business,
  type Customer,
  type Invoice,
  type Payment,
} from "@aba/shared";

const mocks = vi.hoisted(() => ({
  getBusiness: vi.fn(),
  countCustomers: vi.fn(),
  countInvoices: vi.fn(),
  listAppointments: vi.fn(),
  listOutstanding: vi.fn(),
  listPaymentsRange: vi.fn(),
  listPaymentsByInvoice: vi.fn(),
  getCustomer: vi.fn(),
  getService: vi.fn(),
  getUser: vi.fn(),
  listAudit: vi.fn(),
}));

vi.mock("../../repositories/business.repository.js", () => ({
  businessRepository: { getById: mocks.getBusiness },
}));
vi.mock("../../repositories/customer.repository.js", () => ({
  customerRepository: {
    countActive: mocks.countCustomers,
    getById: mocks.getCustomer,
  },
}));
vi.mock("../../repositories/appointment.repository.js", () => ({
  appointmentRepository: { listByDateRange: mocks.listAppointments },
}));
vi.mock("../../repositories/invoice.repository.js", () => ({
  invoiceRepository: {
    countActive: mocks.countInvoices,
    listOutstanding: mocks.listOutstanding,
  },
}));
vi.mock("../../repositories/payment.repository.js", () => ({
  paymentRepository: {
    listCompletedInRange: mocks.listPaymentsRange,
    listByInvoice: mocks.listPaymentsByInvoice,
  },
}));
vi.mock("../../repositories/catalog.repository.js", () => ({
  serviceRepository: { getById: mocks.getService },
}));
vi.mock("../../repositories/user.repository.js", () => ({
  userRepository: { getById: mocks.getUser },
}));
vi.mock("../../repositories/ops.repository.js", () => ({
  auditLogRepository: { list: mocks.listAudit },
}));

import { getDashboardSummary } from "../../modules/dashboard/services/dashboard.service.js";

const businessA: Business = {
  id: "tenant-a",
  name: "Business A",
  slug: "business-a",
  country: "Kuwait",
  vertical: "salon",
  status: "active",
  locale: "en",
  timezone: "Asia/Kuwait",
  currency: "KWD",
  ownerUid: "user-a",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const businessB: Business = {
  ...businessA,
  id: "tenant-b",
  name: "Business B",
  slug: "business-b",
};

const fullAccess = {
  canViewFinancials: true,
  canViewCustomers: true,
  canViewAppointments: true,
  canViewInvoices: true,
  canViewActivity: true,
};

describe("dashboard service tenant isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.listAudit.mockResolvedValue([]);
    mocks.listPaymentsByInvoice.mockResolvedValue([]);
    mocks.listOutstanding.mockResolvedValue([]);
    mocks.getUser.mockResolvedValue(null);
    mocks.getService.mockResolvedValue(null);
  });

  it("returns only tenant A metrics when tenant A is requested", async () => {
    mocks.getBusiness.mockResolvedValue(businessA);
    mocks.countCustomers.mockResolvedValue(3);
    mocks.countInvoices.mockResolvedValue(2);
    mocks.listAppointments.mockResolvedValue([
      {
        id: "appt-a",
        tenantId: "tenant-a",
        customerId: "cust-a",
        title: "Haircut",
        startsAt: "2026-08-30T07:00:00.000Z",
        endsAt: "2026-08-30T07:30:00.000Z",
        status: "confirmed",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      } as Appointment,
    ]);
    mocks.listPaymentsRange.mockResolvedValue([
      {
        id: "pay-a",
        tenantId: "tenant-a",
        invoiceId: "inv-a",
        amount: { amount: 25, currency: "KWD" },
        status: PaymentStatus.COMPLETED,
        paidAt: "2026-08-30T08:00:00.000Z",
        createdAt: "2026-08-30T08:00:00.000Z",
        updatedAt: "2026-08-30T08:00:00.000Z",
      } satisfies Payment,
    ]);
    mocks.getCustomer.mockResolvedValue({
      id: "cust-a",
      tenantId: "tenant-a",
      name: "Customer A",
      status: "active",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    } as Customer);

    const result = await getDashboardSummary("tenant-a", fullAccess);

    expect(result.tenantId).toBe("tenant-a");
    expect(result.summary.customers).toBe(3);
    expect(result.summary.invoices).toBe(2);
    expect(result.todayAppointments[0]?.customerName).toBe("Customer A");
    expect(mocks.countCustomers).toHaveBeenCalledWith("tenant-a");
    expect(mocks.listAppointments).toHaveBeenCalledWith(
      "tenant-a",
      expect.any(String),
      expect.any(String),
      50
    );
  });

  it("does not leak tenant B data when tenant B is requested", async () => {
    mocks.getBusiness.mockResolvedValue(businessB);
    mocks.countCustomers.mockResolvedValue(9);
    mocks.countInvoices.mockResolvedValue(4);
    mocks.listAppointments.mockResolvedValue([]);
    mocks.listPaymentsRange.mockResolvedValue([]);

    const result = await getDashboardSummary("tenant-b", fullAccess);

    expect(result.tenantId).toBe("tenant-b");
    expect(result.businessName).toBe("Business B");
    expect(result.summary.customers).toBe(9);
    expect(mocks.countCustomers).toHaveBeenCalledWith("tenant-b");
    expect(mocks.countCustomers).not.toHaveBeenCalledWith("tenant-a");
  });

  it("hides financial metrics when access is denied", async () => {
    mocks.getBusiness.mockResolvedValue(businessA);
    mocks.countCustomers.mockResolvedValue(1);
    mocks.listAppointments.mockResolvedValue([]);

    const result = await getDashboardSummary("tenant-a", {
      ...fullAccess,
      canViewFinancials: false,
      canViewInvoices: false,
    });

    expect(result.summary.revenue).toBeNull();
    expect(result.summary.pendingPayments).toBeNull();
    expect(result.summary.invoices).toBeNull();
    expect(mocks.listPaymentsRange).not.toHaveBeenCalled();
  });

  it("calculates pending payments from outstanding invoices", async () => {
    mocks.getBusiness.mockResolvedValue(businessA);
    mocks.countCustomers.mockResolvedValue(0);
    mocks.countInvoices.mockResolvedValue(1);
    mocks.listAppointments.mockResolvedValue([]);
    mocks.listPaymentsRange.mockResolvedValue([]);
    mocks.listOutstanding.mockResolvedValue([
      {
        id: "inv-1",
        tenantId: "tenant-a",
        customerId: "cust-a",
        number: "INV-1",
        status: InvoiceStatus.SENT,
        lineItems: [],
        subtotal: { amount: 100, currency: "KWD" },
        tax: { amount: 0, currency: "KWD" },
        total: { amount: 100, currency: "KWD" },
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      } satisfies Invoice,
    ]);
    mocks.listPaymentsByInvoice.mockResolvedValue([
      {
        id: "pay-1",
        tenantId: "tenant-a",
        invoiceId: "inv-1",
        amount: { amount: 40, currency: "KWD" },
        status: PaymentStatus.COMPLETED,
        paidAt: "2026-01-02T00:00:00.000Z",
        createdAt: "2026-01-02T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
      } satisfies Payment,
    ]);

    const result = await getDashboardSummary("tenant-a", fullAccess);
    expect(result.summary.pendingPayments?.amount).toBe(60);
  });
});
