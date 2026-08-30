import type { Conversation, Message } from "@aba/shared";
import { AppError } from "@aba/shared";
import { TenantScopedRepository } from "./tenant-repository.js";
import { getDb } from "../db/firestore.js";
import { tenantCollection } from "../db/collections.js";
import { createTimestamps, serializeDoc, softDeleteStamp, touchUpdatedAt } from "../db/timestamps.js";

export class ConversationRepository extends TenantScopedRepository<Conversation> {
  protected readonly subcollection = "conversations" as const;

  async listByCustomer(
    tenantId: string,
    customerId: string,
    limit = 50
  ): Promise<Conversation[]> {
    this.assertTenantId(tenantId);
    // Path-scoped + in-memory filter avoids extra composite indexes.
    const snap = await this.col(tenantId).where("tenantId", "==", tenantId).limit(500).get();
    return snap.docs
      .filter((d) => !d.data().deletedAt && d.data().customerId === customerId)
      .sort((a, b) => {
        const aAt = String(a.data().lastMessageAt ?? a.data().updatedAt ?? "");
        const bAt = String(b.data().lastMessageAt ?? b.data().updatedAt ?? "");
        return bAt.localeCompare(aAt);
      })
      .slice(0, limit)
      .map((d) => serializeDoc<Conversation>(d.id, d.data()));
  }
}

/**
 * Messages live under `tenants/{tenantId}/conversations/{conversationId}/messages`.
 * Every write requires tenantId + conversationId; tenantId is always stored on the doc.
 */
export class MessageRepository {
  private messages(tenantId: string, conversationId: string) {
    if (!tenantId || !conversationId) {
      throw AppError.validation("tenantId and conversationId are required");
    }
    return getDb()
      .collection(tenantCollection(tenantId, "conversations"))
      .doc(conversationId)
      .collection("messages");
  }

  async getById(tenantId: string, conversationId: string, messageId: string): Promise<Message | null> {
    const snap = await this.messages(tenantId, conversationId).doc(messageId).get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    if (data.tenantId !== tenantId || data.conversationId !== conversationId) {
      throw AppError.forbidden("Cross-tenant access denied");
    }
    if (data.deletedAt) return null;
    return serializeDoc<Message>(snap.id, data);
  }

  async list(tenantId: string, conversationId: string, limit = 100): Promise<Message[]> {
    const snap = await this.messages(tenantId, conversationId)
      .orderBy("createdAt", "asc")
      .limit(limit)
      .get();

    return snap.docs
      .filter((d) => d.data().tenantId === tenantId && !d.data().deletedAt)
      .map((d) => serializeDoc<Message>(d.id, d.data()));
  }

  async create(
    tenantId: string,
    conversationId: string,
    data: Omit<Message, "id" | "createdAt" | "updatedAt" | "tenantId" | "conversationId"> & {
      id?: string;
    }
  ): Promise<Message> {
    if ((data as { tenantId?: string }).tenantId && (data as { tenantId?: string }).tenantId !== tenantId) {
      throw AppError.forbidden("Cannot create message for another tenant");
    }
    const ref = data.id
      ? this.messages(tenantId, conversationId).doc(data.id)
      : this.messages(tenantId, conversationId).doc();
    const { id: _i, ...rest } = data;
    await ref.set({
      ...rest,
      tenantId,
      conversationId,
      deletedAt: null,
      ...createTimestamps(),
    });
    const created = await ref.get();
    return serializeDoc<Message>(ref.id, created.data()!);
  }

  async softDelete(tenantId: string, conversationId: string, messageId: string): Promise<void> {
    const existing = await this.getById(tenantId, conversationId, messageId);
    if (!existing) throw AppError.notFound("messages");
    await this.messages(tenantId, conversationId)
      .doc(messageId)
      .set({ ...softDeleteStamp() }, { merge: true });
  }

  async update(
    tenantId: string,
    conversationId: string,
    messageId: string,
    patch: Partial<Omit<Message, "id" | "tenantId" | "conversationId" | "createdAt">>
  ): Promise<Message> {
    const existing = await this.getById(tenantId, conversationId, messageId);
    if (!existing) throw AppError.notFound("messages");
    const safe = { ...(patch as Record<string, unknown>) };
    delete safe.tenantId;
    delete safe.conversationId;
    delete safe.id;
    await this.messages(tenantId, conversationId)
      .doc(messageId)
      .set({ ...safe, ...touchUpdatedAt() }, { merge: true });
    const updated = await this.getById(tenantId, conversationId, messageId);
    if (!updated) throw AppError.notFound("messages");
    return updated;
  }
}

export const conversationRepository = new ConversationRepository();
export const messageRepository = new MessageRepository();
