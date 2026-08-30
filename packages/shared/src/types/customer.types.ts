import type { SoftDelete, Timestamps } from "./common.types.js";
import type { EntityStatus } from "../constants/statuses.js";
import type { PaginationMeta } from "./api.types.js";

/** How the customer entered the CRM. */
export const CustomerSource = {
  MANUAL: "manual",
  WHATSAPP: "whatsapp",
  BOOKING: "booking",
  IMPORT: "import",
  WEBSITE: "website",
  AI_ASSISTANT: "ai_assistant",
  REFERRAL: "referral",
} as const;

export type CustomerSource = (typeof CustomerSource)[keyof typeof CustomerSource];

export type Customer = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    name: string;
    /** @deprecated Prefer `name`. Kept for docs created with older client writes. */
    fullName?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    notes?: string;
    tags?: string[];
    status: EntityStatus;
    source?: CustomerSource;
  };

export type CustomerListQuery = {
  page: number;
  pageSize: number;
  search?: string;
  tag?: string;
  source?: CustomerSource;
  status?: EntityStatus;
  sortBy: "name" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
};

export type CustomerListResponse = {
  customers: Customer[];
  pagination: PaginationMeta;
};

export type CustomerTimelineEventType =
  | "customer.created"
  | "customer.updated"
  | "customer.deleted"
  | "customer.imported"
  | "appointment"
  | "quotation"
  | "invoice"
  | "payment"
  | "conversation"
  | "note"
  | "audit";

export type CustomerTimelineEvent = {
  id: string;
  type: CustomerTimelineEventType;
  title: string;
  description?: string;
  occurredAt: string;
  resourceType?: string;
  resourceId?: string;
};

export type CustomerDetailAccess = {
  canViewAppointments: boolean;
  canViewQuotations: boolean;
  canViewInvoices: boolean;
  canViewPayments: boolean;
  canViewConversations: boolean;
};

export type CustomerDetailResponse = {
  customer: Customer;
  appointments: unknown[];
  quotations: unknown[];
  invoices: unknown[];
  payments: unknown[];
  conversations: unknown[];
  timeline: CustomerTimelineEvent[];
  access: CustomerDetailAccess;
};

export type CustomerImportRowResult = {
  row: number;
  status: "created" | "skipped" | "duplicate" | "failed";
  message?: string;
  customerId?: string;
  name?: string;
};

export type CustomerImportPreviewRow = {
  row: number;
  valid: boolean;
  errors: string[];
  data: {
    name: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    notes?: string;
    tags: string[];
    source: CustomerSource;
  };
  duplicate?: boolean;
  duplicateReason?: string;
};

export type CustomerImportPreviewResponse = {
  rows: CustomerImportPreviewRow[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
};

export type CustomerImportResult = {
  created: number;
  skipped: number;
  duplicates: number;
  failed: number;
  results: CustomerImportRowResult[];
};

export type CustomerExportResponse = {
  csv: string;
  filename: string;
  count: number;
};
