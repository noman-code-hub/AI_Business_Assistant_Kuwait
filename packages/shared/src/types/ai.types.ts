export type AiMessageRole = "system" | "user" | "assistant" | "tool";

export type AiChatMessage = {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
};

export type AiChatSession = {
  id: string;
  tenantId: string;
  userId: string;
  title?: string;
  messages: AiChatMessage[];
  createdAt: string;
  updatedAt: string;
};
