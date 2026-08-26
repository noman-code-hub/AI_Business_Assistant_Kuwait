import type { InvoiceStatus } from "../constants/statuses.js";
import type { MoneyKwd, SoftDelete, Timestamps } from "./common.types.js";

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: MoneyKwd;
  total: MoneyKwd;
};

export type Invoice = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    status: InvoiceStatus;
    lineItems: InvoiceLineItem[];
    subtotal: MoneyKwd;
    tax: MoneyKwd;
    total: MoneyKwd;
    dueAt?: string;
    paidAt?: string;
  };
