export const Locale = {
  EN: "en",
  AR: "ar",
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export const LOCALES = Object.values(Locale);

export const DEFAULT_LOCALE: Locale = Locale.EN;
export const DEFAULT_TIMEZONE = "Asia/Kuwait";
export const DEFAULT_CURRENCY = "KWD";
export const KUWAIT_PHONE_PREFIX = "+965";
