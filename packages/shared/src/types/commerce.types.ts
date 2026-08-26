import type { SoftDelete, Timestamps, MoneyKwd } from "./common.types.js";
import type { QuotationStatus, PaymentStatus } from "../constants/domain-statuses.js";

export type QuotationLineItem = {
  description: string;
  quantity: number;
  unitPrice: MoneyKwd;
  total: MoneyKwd;
};

export type Quotation = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    status: QuotationStatus;
    lineItems: QuotationLineItem[];
    subtotal: MoneyKwd;
    tax: MoneyKwd;
    total: MoneyKwd;
    validUntil?: string;
    sentAt?: string | null;
  };

export type Payment = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    invoiceId: string;
    amount: MoneyKwd;
    status: PaymentStatus;
    method?: string;
    paidAt?: string | null;
    reference?: string;
  };
