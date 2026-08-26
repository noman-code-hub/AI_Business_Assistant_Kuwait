import type { SoftDelete, Timestamps } from "./common.types.js";
import type { ConversationStatus } from "../constants/domain-statuses.js";

export type Conversation = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    customerId?: string;
    channel: "whatsapp" | "web" | "phone" | "other";
    status: ConversationStatus;
    subject?: string;
    lastMessageAt?: string;
    unreadCount?: number;
  };

export type Message = Timestamps &
  SoftDelete & {
    id: string;
    tenantId: string;
    conversationId: string;
    direction: "inbound" | "outbound";
    body: string;
    senderType: "customer" | "staff" | "ai" | "system";
    senderId?: string;
    sentAt?: string;
  };
