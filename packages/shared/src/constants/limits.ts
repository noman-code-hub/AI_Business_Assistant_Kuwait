export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

export const PlanLimits = {
  FREE: {
    users: 2,
    customers: 100,
    aiMessagesPerMonth: 50,
    whatsappMessagesPerMonth: 0,
  },
  STARTER: {
    users: 5,
    customers: 1000,
    aiMessagesPerMonth: 500,
    whatsappMessagesPerMonth: 200,
  },
  GROWTH: {
    users: 20,
    customers: 10000,
    aiMessagesPerMonth: 5000,
    whatsappMessagesPerMonth: 2000,
  },
  ENTERPRISE: {
    users: 100,
    customers: 100000,
    aiMessagesPerMonth: 50000,
    whatsappMessagesPerMonth: 20000,
  },
} as const;

export type PlanTier = keyof typeof PlanLimits;
