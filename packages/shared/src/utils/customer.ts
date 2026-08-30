import { normalizeKuwaitPhone, normalizeContactPhone } from "./phone.js";

/** Normalize tags: trim, collapse spaces, drop empties, dedupe case-insensitively. */
export function normalizeCustomerTags(tags: string[] | undefined | null): string[] {
  if (!tags?.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = String(raw ?? "")
      .trim()
      .replace(/\s+/g, " ");
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out;
}

/**
 * Normalize optional contact phone to E.164 (Kuwait + international).
 * Returns { ok, value } — empty input is ok with undefined value.
 */
export function normalizeOptionalContactPhone(
  input: string | undefined | null
): { ok: true; value: string | undefined } | { ok: false; message: string } {
  if (input == null || String(input).trim() === "") {
    return { ok: true, value: undefined };
  }
  const normalized = normalizeContactPhone(String(input).trim());
  if (!normalized) {
    return {
      ok: false,
      message: "Must be a valid phone number (e.g. +965######## or +923##########)",
    };
  }
  return { ok: true, value: normalized };
}

/**
 * @deprecated Use normalizeOptionalContactPhone for CRM (supports international E.164).
 */
export function normalizeOptionalKuwaitPhone(
  input: string | undefined | null
): { ok: true; value: string | undefined } | { ok: false; message: string } {
  return normalizeOptionalContactPhone(input);
}

/**
 * Escape CSV formula injection: prefix cells that start with = + - @ with a single quote.
 * Also escape quotes and wrap fields containing commas/newlines.
 */
export function escapeCsvCell(value: string | number | null | undefined): string {
  const raw = value == null ? "" : String(value);
  let safe = raw;
  if (/^[=+\-@]/.test(safe)) {
    safe = `'${safe}`;
  }
  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function toCsvRow(fields: Array<string | number | null | undefined>): string {
  return fields.map(escapeCsvCell).join(",");
}

/** Minimal CSV line splitter that respects double-quoted fields. */
export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells.map((c) => c.trim());
}

export function splitCsvRows(csv: string): string[] {
  const normalized = csv.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return normalized
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l, idx, arr) => !(l === "" && idx === arr.length - 1));
}
