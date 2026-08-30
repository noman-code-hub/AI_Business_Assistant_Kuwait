import type {
  CreateCustomerInput,
  Customer,
  CustomerDetailResponse,
  CustomerExportResponse,
  CustomerImportPreviewResponse,
  CustomerImportResult,
  CustomerListResponse,
  ListCustomersQuery,
  UpdateCustomerInput,
} from "@aba/shared";
import { apiFetch } from "./client";

export type CustomerListParams = Partial<ListCustomersQuery>;

function toQueryString(params: CustomerListParams): string {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.pageSize != null) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.tag) q.set("tag", params.tag);
  if (params.source) q.set("source", params.source);
  if (params.status) q.set("status", params.status);
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortOrder) q.set("sortOrder", params.sortOrder);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function fetchCustomers(
  tenantId: string | null,
  params: CustomerListParams = {}
): Promise<CustomerListResponse> {
  return apiFetch<CustomerListResponse>(`/customers${toQueryString(params)}`, { tenantId });
}

export function fetchCustomer(
  tenantId: string | null,
  customerId: string
): Promise<{ customer: Customer }> {
  return apiFetch<{ customer: Customer }>(`/customers/${customerId}`, { tenantId });
}

export function fetchCustomerDetail(
  tenantId: string | null,
  customerId: string
): Promise<CustomerDetailResponse> {
  return apiFetch<CustomerDetailResponse>(`/customers/${customerId}/detail`, { tenantId });
}

export function createCustomerApi(
  tenantId: string | null,
  body: CreateCustomerInput
): Promise<{ customer: Customer }> {
  return apiFetch<{ customer: Customer }>("/customers", {
    method: "POST",
    body,
    tenantId,
  });
}

export function updateCustomerApi(
  tenantId: string | null,
  customerId: string,
  body: UpdateCustomerInput
): Promise<{ customer: Customer }> {
  return apiFetch<{ customer: Customer }>(`/customers/${customerId}`, {
    method: "PATCH",
    body,
    tenantId,
  });
}

export function deleteCustomerApi(
  tenantId: string | null,
  customerId: string
): Promise<{ deleted: boolean }> {
  return apiFetch<{ deleted: boolean }>(`/customers/${customerId}`, {
    method: "DELETE",
    tenantId,
  });
}

export function previewCustomerImport(
  tenantId: string | null,
  csv: string
): Promise<CustomerImportPreviewResponse> {
  return apiFetch<CustomerImportPreviewResponse>("/customers/import", {
    method: "POST",
    body: { csv, confirm: false },
    tenantId,
  });
}

export function confirmCustomerImport(
  tenantId: string | null,
  csv: string
): Promise<CustomerImportResult> {
  return apiFetch<CustomerImportResult>("/customers/import", {
    method: "POST",
    body: { csv, confirm: true },
    tenantId,
  });
}

export function exportCustomersApi(tenantId: string | null): Promise<CustomerExportResponse> {
  return apiFetch<CustomerExportResponse>("/customers/export", { tenantId });
}

export const CUSTOMER_CSV_TEMPLATE = `name,phone,whatsapp,email,address,notes,tags,source
Ahmed Al-Ahmad,+96550000001,+96550000001,ahmed@example.com,Salmiya,Preferred client,VIP|Regular,manual`;

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
