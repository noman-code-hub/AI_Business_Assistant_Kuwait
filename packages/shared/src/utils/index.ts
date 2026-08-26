import { KUWAIT_PHONE_PREFIX } from "../constants/locales.js";

/** Normalize Kuwait local numbers to E.164 (+965########). */
export function normalizeKuwaitPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${KUWAIT_PHONE_PREFIX}${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("965")) {
    return `+${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("965")) {
    return `+${digits.slice(0, 11)}`;
  }
  if (input.startsWith("+965") && digits.length === 11) {
    return `+${digits}`;
  }
  return null;
}

export function formatKwd(amount: number): string {
  return `${amount.toLocaleString("en-KW", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} KWD`;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
