import {
  AppError,
  CUSTOMER_CSV_MAX_ROWS,
  EntityStatus,
  normalizeCustomerTags,
  normalizeOptionalContactPhone,
  parseCsvLine,
  splitCsvRows,
  toCsvRow,
  type CreateCustomerInput,
  type Customer,
  type CustomerDetailAccess,
  type CustomerDetailResponse,
  type CustomerExportResponse,
  type CustomerImportBody,
  type CustomerImportPreviewResponse,
  type CustomerImportPreviewRow,
  type CustomerImportResult,
  type CustomerImportRowResult,
  type CustomerListResponse,
  type CustomerSource,
  type CustomerTimelineEvent,
  type ListCustomersQuery,
  type UpdateCustomerInput,
  hasPermission,
  PERMISSIONS,
  type Role,
} from "@aba/shared";
import { customerRepository } from "../../../repositories/customer.repository.js";
import { appointmentRepository } from "../../../repositories/appointment.repository.js";
import { invoiceRepository } from "../../../repositories/invoice.repository.js";
import { quotationRepository } from "../../../repositories/quotation.repository.js";
import { paymentRepository } from "../../../repositories/payment.repository.js";
import { conversationRepository } from "../../../repositories/messaging.repository.js";
import { auditLogRepository } from "../../../repositories/ops.repository.js";
import { buildPaginationMeta } from "../../../lib/api-response.js";

export type CustomerAuthz = {
  userId: string;
  tenantId: string;
  role: Role;
};

const SORTABLE = new Set(["name", "createdAt", "updatedAt"]);

const CSV_HEADERS = [
  "name",
  "phone",
  "whatsapp",
  "email",
  "address",
  "notes",
  "tags",
  "source",
] as const;

const EXPORT_HEADERS = [
  "name",
  "phone",
  "whatsapp",
  "email",
  "address",
  "tags",
  "notes",
  "source",
  "createdAt",
  "updatedAt",
] as const;

const ALLOWED_SOURCES = new Set<CustomerSource>([
  "manual",
  "whatsapp",
  "booking",
  "import",
  "website",
  "ai_assistant",
  "referral",
]);

function displayName(c: Customer): string {
  return c.name || c.fullName || "Customer";
}

function normalizeContacts(input: {
  phone?: string;
  whatsapp?: string;
  email?: string;
}): { phone?: string; whatsapp?: string; email?: string } {
  const phoneResult = normalizeOptionalContactPhone(input.phone);
  if (!phoneResult.ok) throw AppError.validation(phoneResult.message, [{ path: "phone", message: phoneResult.message }]);

  const whatsappResult = normalizeOptionalContactPhone(input.whatsapp);
  if (!whatsappResult.ok) {
    throw AppError.validation(whatsappResult.message, [
      { path: "whatsapp", message: whatsappResult.message },
    ]);
  }

  return {
    phone: phoneResult.value,
    whatsapp: whatsappResult.value,
    email: input.email,
  };
}

function compareCustomers(
  a: Customer,
  b: Customer,
  sortBy: string,
  sortOrder: "asc" | "desc"
): number {
  const dir = sortOrder === "asc" ? 1 : -1;
  let av = "";
  let bv = "";
  if (sortBy === "name") {
    av = displayName(a).toLowerCase();
    bv = displayName(b).toLowerCase();
  } else if (sortBy === "updatedAt") {
    av = a.updatedAt ?? "";
    bv = b.updatedAt ?? "";
  } else {
    av = a.createdAt ?? "";
    bv = b.createdAt ?? "";
  }
  if (av < bv) return -1 * dir;
  if (av > bv) return 1 * dir;
  // Stable secondary: id
  return a.id.localeCompare(b.id) * dir;
}

function matchesSearch(c: Customer, search: string): boolean {
  const q = search.toLowerCase();
  const hay = [
    c.name,
    c.fullName,
    c.phone,
    c.whatsapp,
    c.email,
    c.address,
    c.notes,
    ...(c.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

async function appendAudit(
  tenantId: string,
  actorUserId: string,
  action: string,
  resourceId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await auditLogRepository.append(tenantId, {
      actorUserId,
      action,
      resourceType: "customer",
      resourceId,
      metadata,
    });
  } catch {
    // Non-fatal
  }
}

export async function listCustomers(
  ctx: CustomerAuthz,
  query: ListCustomersQuery
): Promise<CustomerListResponse> {
  if (!SORTABLE.has(query.sortBy)) {
    throw AppError.validation("Invalid sortBy", [{ path: "sortBy", message: "Not allowed" }]);
  }

  let all = await customerRepository.listAllActive(ctx.tenantId, {
    status: query.status,
  });

  if (query.search) {
    all = all.filter((c) => matchesSearch(c, query.search!));
  }
  if (query.tag) {
    const tagKey = query.tag.toLowerCase();
    all = all.filter((c) => (c.tags ?? []).some((t) => t.toLowerCase() === tagKey));
  }
  if (query.source) {
    all = all.filter((c) => c.source === query.source);
  }

  all.sort((a, b) => compareCustomers(a, b, query.sortBy, query.sortOrder));

  const total = all.length;
  const start = (query.page - 1) * query.pageSize;
  const customers = all.slice(start, start + query.pageSize);

  return {
    customers,
    pagination: buildPaginationMeta({
      page: query.page,
      pageSize: query.pageSize,
      total,
    }),
  };
}

export async function getCustomer(ctx: CustomerAuthz, customerId: string): Promise<Customer> {
  const customer = await customerRepository.getById(ctx.tenantId, customerId);
  if (!customer) throw AppError.notFound("customer");
  return customer;
}

export async function createCustomer(
  ctx: CustomerAuthz,
  input: CreateCustomerInput
): Promise<Customer> {
  const contacts = normalizeContacts(input);
  const tags = normalizeCustomerTags(input.tags);

  const dup = await customerRepository.findDuplicate(ctx.tenantId, contacts);
  if (dup) {
    throw AppError.conflict(`Duplicate customer (${dup.reason})`);
  }

  const customer = await customerRepository.create(ctx.tenantId, {
    tenantId: ctx.tenantId,
    name: input.name.trim(),
    email: contacts.email,
    phone: contacts.phone,
    whatsapp: contacts.whatsapp,
    address: input.address,
    notes: input.notes,
    tags,
    status: input.status ?? EntityStatus.ACTIVE,
    source: input.source ?? "manual",
  });

  await appendAudit(ctx.tenantId, ctx.userId, "customer.created", customer.id, {
    source: customer.source,
  });

  return customer;
}

export async function updateCustomer(
  ctx: CustomerAuthz,
  customerId: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  const existing = await customerRepository.getById(ctx.tenantId, customerId);
  if (!existing) throw AppError.notFound("customer");

  const contacts = normalizeContacts({
    phone: input.phone !== undefined ? input.phone : existing.phone,
    whatsapp: input.whatsapp !== undefined ? input.whatsapp : existing.whatsapp,
    email: input.email !== undefined ? input.email : existing.email,
  });

  // Only check duplicates for fields that are being set / remain set
  const dup = await customerRepository.findDuplicate(
    ctx.tenantId,
    {
      phone: contacts.phone,
      whatsapp: contacts.whatsapp,
      email: contacts.email,
    },
    customerId
  );
  if (dup) {
    throw AppError.conflict(`Duplicate customer (${dup.reason})`);
  }

  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.email !== undefined) patch.email = contacts.email ?? null;
  if (input.phone !== undefined) patch.phone = contacts.phone ?? null;
  if (input.whatsapp !== undefined) patch.whatsapp = contacts.whatsapp ?? null;
  if (input.address !== undefined) patch.address = input.address;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.tags !== undefined) patch.tags = normalizeCustomerTags(input.tags);
  if (input.status !== undefined) patch.status = input.status;
  if (input.source !== undefined) patch.source = input.source;

  const updated = await customerRepository.update(ctx.tenantId, customerId, patch);

  await appendAudit(ctx.tenantId, ctx.userId, "customer.updated", customerId);

  return updated;
}

export async function deleteCustomer(ctx: CustomerAuthz, customerId: string): Promise<void> {
  const existing = await customerRepository.getById(ctx.tenantId, customerId);
  if (!existing) throw AppError.notFound("customer");

  // Soft delete only — never cascade to invoices/appointments/payments.
  await customerRepository.softDelete(ctx.tenantId, customerId);

  await appendAudit(ctx.tenantId, ctx.userId, "customer.deleted", customerId);
}

function buildAccess(role: Role): CustomerDetailAccess {
  return {
    canViewAppointments: hasPermission(role, PERMISSIONS.APPOINTMENTS_READ),
    canViewQuotations: hasPermission(role, PERMISSIONS.INVOICES_READ),
    canViewInvoices: hasPermission(role, PERMISSIONS.INVOICES_READ),
    canViewPayments: hasPermission(role, PERMISSIONS.PAYMENTS_READ),
    canViewConversations: hasPermission(role, PERMISSIONS.CUSTOMERS_READ),
  };
}

export async function getCustomerDetail(
  ctx: CustomerAuthz,
  customerId: string
): Promise<CustomerDetailResponse> {
  const customer = await getCustomer(ctx, customerId);
  const access = buildAccess(ctx.role);

  const [appointments, quotations, invoices, conversations] = await Promise.all([
    access.canViewAppointments
      ? appointmentRepository.listByCustomer(ctx.tenantId, customerId, 50).catch(() => [])
      : Promise.resolve([]),
    access.canViewQuotations
      ? quotationRepository.listByCustomer(ctx.tenantId, customerId, 50).catch(() => [])
      : Promise.resolve([]),
    access.canViewInvoices
      ? invoiceRepository.listByCustomer(ctx.tenantId, customerId, 50).catch(() => [])
      : Promise.resolve([]),
    access.canViewConversations
      ? conversationRepository.listByCustomer(ctx.tenantId, customerId, 50).catch(() => [])
      : Promise.resolve([]),
  ]);

  let payments: Awaited<ReturnType<typeof paymentRepository.listByInvoice>> = [];
  if (access.canViewPayments && invoices.length > 0) {
    const nested = await Promise.all(
      invoices.slice(0, 50).map((inv) =>
        paymentRepository.listByInvoice(ctx.tenantId, inv.id, 20).catch(() => [])
      )
    );
    payments = nested.flat().sort((a, b) => {
      const aAt = a.paidAt ?? a.createdAt ?? "";
      const bAt = b.paidAt ?? b.createdAt ?? "";
      return bAt.localeCompare(aAt);
    });
  }

  const timeline = buildTimeline({
    customer,
    appointments,
    quotations,
    invoices,
    payments,
    conversations,
  });

  return {
    customer,
    appointments: access.canViewAppointments ? appointments : [],
    quotations: access.canViewQuotations ? quotations : [],
    invoices: access.canViewInvoices ? invoices : [],
    payments: access.canViewPayments ? payments : [],
    conversations: access.canViewConversations ? conversations : [],
    timeline,
    access,
  };
}

function buildTimeline(input: {
  customer: Customer;
  appointments: Array<{ id: string; startsAt?: string; status?: string; createdAt?: string }>;
  quotations: Array<{ id: string; number?: string; status?: string; createdAt?: string; sentAt?: string | null }>;
  invoices: Array<{ id: string; number?: string; status?: string; createdAt?: string; total?: { amount: number; currency: string } }>;
  payments: Array<{ id: string; invoiceId: string; amount: { amount: number; currency: string }; status?: string; paidAt?: string | null; createdAt?: string; method?: string }>;
  conversations: Array<{ id: string; channel?: string; status?: string; createdAt?: string; lastMessageAt?: string }>;
}): CustomerTimelineEvent[] {
  const events: CustomerTimelineEvent[] = [];

  events.push({
    id: `customer-created-${input.customer.id}`,
    type: "customer.created",
    title: "Customer created",
    description: displayName(input.customer),
    occurredAt: input.customer.createdAt,
    resourceType: "customer",
    resourceId: input.customer.id,
  });

  if (input.customer.updatedAt && input.customer.updatedAt !== input.customer.createdAt) {
    events.push({
      id: `customer-updated-${input.customer.id}-${input.customer.updatedAt}`,
      type: "customer.updated",
      title: "Customer updated",
      occurredAt: input.customer.updatedAt,
      resourceType: "customer",
      resourceId: input.customer.id,
    });
  }

  if (input.customer.notes?.trim()) {
    events.push({
      id: `customer-note-${input.customer.id}`,
      type: "note",
      title: "Notes on file",
      description: input.customer.notes.slice(0, 160),
      occurredAt: input.customer.updatedAt || input.customer.createdAt,
      resourceType: "customer",
      resourceId: input.customer.id,
    });
  }

  for (const a of input.appointments) {
    events.push({
      id: `appointment-${a.id}`,
      type: "appointment",
      title: "Appointment",
      description: a.status ? `Status: ${a.status}` : undefined,
      occurredAt: a.startsAt || a.createdAt || input.customer.createdAt,
      resourceType: "appointment",
      resourceId: a.id,
    });
  }

  for (const q of input.quotations) {
    events.push({
      id: `quotation-${q.id}`,
      type: "quotation",
      title: q.number ? `Quotation ${q.number}` : "Quotation",
      description: q.status ? `Status: ${q.status}` : undefined,
      occurredAt: q.sentAt || q.createdAt || input.customer.createdAt,
      resourceType: "quotation",
      resourceId: q.id,
    });
  }

  for (const inv of input.invoices) {
    const amount =
      inv.total != null ? `${inv.total.amount} ${inv.total.currency}` : undefined;
    events.push({
      id: `invoice-${inv.id}`,
      type: "invoice",
      title: inv.number ? `Invoice ${inv.number}` : "Invoice",
      description: [inv.status, amount].filter(Boolean).join(" · ") || undefined,
      occurredAt: inv.createdAt || input.customer.createdAt,
      resourceType: "invoice",
      resourceId: inv.id,
    });
  }

  for (const p of input.payments) {
    events.push({
      id: `payment-${p.id}`,
      type: "payment",
      title: "Payment received",
      description: `${p.amount.amount} ${p.amount.currency}${p.method ? ` · ${p.method}` : ""}`,
      occurredAt: p.paidAt || p.createdAt || input.customer.createdAt,
      resourceType: "payment",
      resourceId: p.id,
    });
  }

  for (const c of input.conversations) {
    events.push({
      id: `conversation-${c.id}`,
      type: "conversation",
      title: c.channel ? `${c.channel} conversation` : "Conversation",
      description: c.status ? `Status: ${c.status}` : undefined,
      occurredAt: c.lastMessageAt || c.createdAt || input.customer.createdAt,
      resourceType: "conversation",
      resourceId: c.id,
    });
  }

  events.sort((a, b) => {
    const cmp = b.occurredAt.localeCompare(a.occurredAt);
    if (cmp !== 0) return cmp;
    return a.id.localeCompare(b.id);
  });

  return events;
}

function parseTagsCell(raw: string): string[] {
  if (!raw.trim()) return [];
  return normalizeCustomerTags(
    raw
      .split(/[|;]/)
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

function mapHeaderIndex(headerCells: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headerCells.forEach((h, i) => {
    map[h.trim().toLowerCase()] = i;
  });
  return map;
}

function cell(cells: string[], map: Record<string, number>, key: string): string {
  const idx = map[key];
  if (idx == null) return "";
  return cells[idx] ?? "";
}

function parseImportSource(raw: string): CustomerSource {
  const v = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (!v) return "import";
  if (ALLOWED_SOURCES.has(v as CustomerSource)) return v as CustomerSource;
  return "import";
}

export async function previewOrImportCustomers(
  ctx: CustomerAuthz,
  body: CustomerImportBody
): Promise<CustomerImportPreviewResponse | CustomerImportResult> {
  const lines = splitCsvRows(body.csv).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    throw AppError.validation("CSV must include a header row and at least one data row");
  }

  const headerMap = mapHeaderIndex(parseCsvLine(lines[0]!));
  if (headerMap.name == null) {
    throw AppError.validation("CSV must include a 'name' column");
  }
  // tenantId from CSV is ignored (never used for ownership)
  void headerMap.tenantid;

  const dataLines = lines.slice(1);
  if (dataLines.length > CUSTOMER_CSV_MAX_ROWS) {
    throw AppError.validation(
      `CSV exceeds maximum of ${CUSTOMER_CSV_MAX_ROWS} rows`,
      [{ path: "csv", message: `Too many rows (${dataLines.length})` }]
    );
  }

  const previewRows: CustomerImportPreviewRow[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const rowNum = i + 2; // 1-based including header
    const cells = parseCsvLine(dataLines[i]!);
    const errors: string[] = [];

    const name = cell(cells, headerMap, "name").trim();
    if (!name) errors.push("name is required");
    if (name.length > 120) errors.push("name is too long");

    const phoneRaw = cell(cells, headerMap, "phone");
    const whatsappRaw = cell(cells, headerMap, "whatsapp");
    const emailRaw = cell(cells, headerMap, "email").trim();
    const address = cell(cells, headerMap, "address").trim() || undefined;
    const notes = cell(cells, headerMap, "notes").trim() || undefined;
    const tags = parseTagsCell(cell(cells, headerMap, "tags"));
    const source = parseImportSource(cell(cells, headerMap, "source"));

    const phoneNorm = normalizeOptionalContactPhone(phoneRaw || undefined);
    if (!phoneNorm.ok) errors.push(`phone: ${phoneNorm.message}`);
    const whatsappNorm = normalizeOptionalContactPhone(whatsappRaw || undefined);
    if (!whatsappNorm.ok) errors.push(`whatsapp: ${whatsappNorm.message}`);

    let email: string | undefined;
    if (emailRaw) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) || emailRaw.length > 254) {
        errors.push("email is invalid");
      } else {
        email = emailRaw.toLowerCase();
      }
    }

    if (address && address.length > 500) errors.push("address is too long");
    if (notes && notes.length > 2000) errors.push("notes are too long");

    const data = {
      name,
      phone: phoneNorm.ok ? phoneNorm.value : undefined,
      whatsapp: whatsappNorm.ok ? whatsappNorm.value : undefined,
      email,
      address,
      notes,
      tags,
      source,
    };

    let duplicate = false;
    let duplicateReason: string | undefined;
    if (errors.length === 0) {
      const dup = await customerRepository.findDuplicate(ctx.tenantId, {
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
      });
      if (dup) {
        duplicate = true;
        duplicateReason = dup.reason;
      }
    }

    previewRows.push({
      row: rowNum,
      valid: errors.length === 0 && !duplicate,
      errors: duplicate
        ? [...errors, `Duplicate customer (${duplicateReason})`]
        : errors,
      data: {
        ...data,
        tags,
        source,
        name: name || "",
      },
      duplicate,
      duplicateReason,
    });
  }

  if (!body.confirm) {
    return {
      rows: previewRows,
      summary: {
        total: previewRows.length,
        valid: previewRows.filter((r) => r.valid).length,
        invalid: previewRows.filter((r) => !r.valid && !r.duplicate).length,
        duplicates: previewRows.filter((r) => r.duplicate).length,
      },
    };
  }

  // Confirm import: create valid non-duplicate rows; report failures (partial success).
  const results: CustomerImportRowResult[] = [];
  let created = 0;
  const skipped = 0;
  let duplicates = 0;
  let failed = 0;

  // Track phones/emails created in this batch to avoid intra-file duplicates
  const seenPhone = new Set<string>();
  const seenWhatsapp = new Set<string>();
  const seenEmail = new Set<string>();

  for (const row of previewRows) {
    if (row.duplicate) {
      duplicates += 1;
      results.push({
        row: row.row,
        status: "duplicate",
        message: row.duplicateReason
          ? `Duplicate (${row.duplicateReason})`
          : "Duplicate",
        name: row.data.name,
      });
      continue;
    }
    if (!row.valid) {
      failed += 1;
      results.push({
        row: row.row,
        status: "failed",
        message: row.errors.join("; "),
        name: row.data.name,
      });
      continue;
    }

    if (row.data.phone && seenPhone.has(row.data.phone)) {
      duplicates += 1;
      results.push({
        row: row.row,
        status: "duplicate",
        message: "Duplicate phone in import file",
        name: row.data.name,
      });
      continue;
    }
    if (row.data.whatsapp && seenWhatsapp.has(row.data.whatsapp)) {
      duplicates += 1;
      results.push({
        row: row.row,
        status: "duplicate",
        message: "Duplicate WhatsApp in import file",
        name: row.data.name,
      });
      continue;
    }
    if (row.data.email && seenEmail.has(row.data.email)) {
      duplicates += 1;
      results.push({
        row: row.row,
        status: "duplicate",
        message: "Duplicate email in import file",
        name: row.data.name,
      });
      continue;
    }

    try {
      const customer = await customerRepository.create(ctx.tenantId, {
        tenantId: ctx.tenantId,
        name: row.data.name,
        phone: row.data.phone,
        whatsapp: row.data.whatsapp,
        email: row.data.email,
        address: row.data.address,
        notes: row.data.notes,
        tags: row.data.tags,
        status: EntityStatus.ACTIVE,
        source: row.data.source || "import",
      });
      if (row.data.phone) seenPhone.add(row.data.phone);
      if (row.data.whatsapp) seenWhatsapp.add(row.data.whatsapp);
      if (row.data.email) seenEmail.add(row.data.email);
      created += 1;
      results.push({
        row: row.row,
        status: "created",
        customerId: customer.id,
        name: customer.name,
      });
    } catch (err) {
      failed += 1;
      results.push({
        row: row.row,
        status: "failed",
        message: err instanceof Error ? err.message : "Create failed",
        name: row.data.name,
      });
    }
  }

  await appendAudit(ctx.tenantId, ctx.userId, "customer.imported", ctx.tenantId, {
    created,
    duplicates,
    failed,
    total: previewRows.length,
  });

  return { created, skipped, duplicates, failed, results };
}

export async function exportCustomers(ctx: CustomerAuthz): Promise<CustomerExportResponse> {
  const customers = await customerRepository.listAllActive(ctx.tenantId);
  customers.sort((a, b) => compareCustomers(a, b, "createdAt", "desc"));

  const lines = [
    EXPORT_HEADERS.join(","),
    ...customers.map((c) =>
      toCsvRow([
        displayName(c),
        c.phone,
        c.whatsapp,
        c.email,
        c.address,
        (c.tags ?? []).join("|"),
        c.notes,
        c.source,
        c.createdAt,
        c.updatedAt,
      ])
    ),
  ];

  const date = new Date().toISOString().slice(0, 10);
  const filename = `customers-${date}.csv`;

  await appendAudit(ctx.tenantId, ctx.userId, "customer.exported", ctx.tenantId, {
    count: customers.length,
  });

  return {
    csv: lines.join("\n"),
    filename,
    count: customers.length,
  };
}

export { CSV_HEADERS };
