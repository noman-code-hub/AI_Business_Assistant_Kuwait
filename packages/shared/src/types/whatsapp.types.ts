export type WhatsAppMessageDirection = "inbound" | "outbound";

export type WhatsAppMessage = {
  id: string;
  tenantId: string;
  conversationId: string;
  direction: WhatsAppMessageDirection;
  body: string;
  status: "queued" | "sent" | "delivered" | "read" | "failed";
  externalId?: string;
  createdAt: string;
};

export type WhatsAppConversation = {
  id: string;
  tenantId: string;
  customerId?: string;
  phone: string;
  lastMessageAt: string;
  unreadCount: number;
};
