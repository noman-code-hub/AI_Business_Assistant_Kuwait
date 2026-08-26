import type { UserProfile } from "@aba/shared";
import { AppError } from "@aba/shared";
import { getDb } from "../db/firestore.js";
import { TopLevel } from "../db/collections.js";
import { createTimestamps, serializeDoc, softDeleteStamp, touchUpdatedAt } from "../db/timestamps.js";

export class UserRepository {
  private col() {
    return getDb().collection(TopLevel.users);
  }

  async getById(userId: string): Promise<UserProfile | null> {
    if (!userId) throw AppError.validation("userId is required");
    const snap = await this.col().doc(userId).get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    if (data.deletedAt) return null;
    return serializeDoc<UserProfile>(snap.id, data);
  }

  async upsert(
    userId: string,
    data: Partial<Omit<UserProfile, "id" | "createdAt">> & {
      email?: string | null;
      displayName?: string | null;
    }
  ): Promise<UserProfile> {
    const ref = this.col().doc(userId);
    const existing = await ref.get();
    if (!existing.exists) {
      await ref.set({
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        phone: data.phone ?? null,
        photoURL: data.photoURL ?? null,
        status: data.status ?? "active",
        locale: data.locale ?? "en",
        timezone: data.timezone ?? "Asia/Kuwait",
        lastLoginAt: data.lastLoginAt ?? null,
        deletedAt: null,
        ...createTimestamps(),
      });
    } else {
      const safe = { ...(data as Record<string, unknown>) };
      delete safe.id;
      delete safe.createdAt;
      await ref.set({ ...safe, ...touchUpdatedAt() }, { merge: true });
    }
    const profile = await this.getById(userId);
    if (!profile) throw AppError.notFound("user");
    return profile;
  }

  async softDelete(userId: string): Promise<void> {
    const existing = await this.getById(userId);
    if (!existing) throw AppError.notFound("user");
    await this.col().doc(userId).set(softDeleteStamp(), { merge: true });
  }
}

export const userRepository = new UserRepository();
