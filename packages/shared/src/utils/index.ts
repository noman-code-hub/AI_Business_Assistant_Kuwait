import { KUWAIT_PHONE_PREFIX } from "../constants/locales.js";

export { normalizeKuwaitPhone, normalizeContactPhone } from "./phone.js";

export function formatKwd(amount: number): string {
  return `${amount.toLocaleString("en-KW", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} KWD`;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export * from "./timezone.js";
export * from "./money.js";
export {
  normalizeCustomerTags,
  normalizeOptionalContactPhone,
  normalizeOptionalKuwaitPhone,
  escapeCsvCell,
  toCsvRow,
  parseCsvLine,
  splitCsvRows,
} from "./customer.js";

// Re-export prefix for callers that imported from utils historically
export { KUWAIT_PHONE_PREFIX };
