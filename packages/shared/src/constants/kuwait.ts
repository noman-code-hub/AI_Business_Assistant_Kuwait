export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const KUWAIT_GOVERNORATES = [
  "Al Asimah",
  "Hawalli",
  "Farwaniya",
  "Mubarak Al-Kabeer",
  "Ahmadi",
  "Jahra",
] as const;

export type KuwaitGovernorate = (typeof KUWAIT_GOVERNORATES)[number];
