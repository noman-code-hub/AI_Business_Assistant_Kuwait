/**
 * Color & spacing tokens as TypeScript constants.
 * Keep in sync with styles/tokens.css
 */

export const abaColors = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  primaryMuted: "#DBEAFE",
  secondary: "#0F172A",
  accent: "#14B8A6",
  accentMuted: "#CCFBF1",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
} as const;

export const abaSpacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const abaRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const abaBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const abaLayout = {
  sidebarWidth: 264,
  sidebarCollapsed: 72,
  navbarHeight: 64,
  contentMax: 1440,
  settingsNavWidth: 220,
} as const;
