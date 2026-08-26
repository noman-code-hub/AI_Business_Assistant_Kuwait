import type { SoftDelete, Timestamps } from "./common.types.js";
import type { SubscriptionStatus } from "../constants/domain-statuses.js";

export type Notification = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    userId?: string;
    title: string;
    body: string;
    readAt?: string | null;
    type?: string;
  };

export type Automation = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    name: string;
    trigger: string;
    enabled: boolean;
    config?: Record<string, unknown>;
  };

export type AuditLog = {
  id: string;
  tenantId: string;
  actorUserId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type Subscription = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    planId: string;
    status: SubscriptionStatus;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  };

export type UsageRecord = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    periodId: string;
    metric: string;
    count: number;
  };
