export const QuotationStatus = {
  DRAFT: "draft",
  SENT: "sent",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

export type QuotationStatus = (typeof QuotationStatus)[keyof typeof QuotationStatus];

export const PaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const ConversationStatus = {
  OPEN: "open",
  PENDING: "pending",
  CLOSED: "closed",
} as const;

export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus];

export const SubscriptionStatus = {
  TRIALING: "trialing",
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELLED: "cancelled",
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const MembershipStatus = {
  ACTIVE: "active",
  INVITED: "invited",
  DISABLED: "disabled",
} as const;

export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];

export const UserProfileStatus = {
  ACTIVE: "active",
  DISABLED: "disabled",
} as const;

export type UserProfileStatus = (typeof UserProfileStatus)[keyof typeof UserProfileStatus];
