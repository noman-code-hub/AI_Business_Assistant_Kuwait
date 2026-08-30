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

/**
 * Normalize to E.164. Kuwait local numbers map to +965########; other international +… formats are kept.
 */
export function normalizeContactPhone(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const kuwait = normalizeKuwaitPhone(trimmed);
  if (kuwait) return kuwait;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }
  return `+${digits}`;
}
