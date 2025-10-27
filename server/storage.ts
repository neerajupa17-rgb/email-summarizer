// Based on blueprint:javascript_database
import { emailSummaries, type EmailSummary, type InsertEmailSummary, type UpdateEmailSummary } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Email summary operations
  getAllEmailSummaries(): Promise<EmailSummary[]>;
  getEmailSummary(id: number): Promise<EmailSummary | undefined>;
  createEmailSummary(email: InsertEmailSummary): Promise<EmailSummary>;
  updateEmailSummary(id: number, updates: UpdateEmailSummary): Promise<EmailSummary | undefined>;
  deleteEmailSummary(id: number): Promise<boolean>;
  deleteAllEmailSummaries(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllEmailSummaries(): Promise<EmailSummary[]> {
    const results = await db
      .select()
      .from(emailSummaries)
      .orderBy(desc(emailSummaries.processedAt));
    return results;
  }

  async getEmailSummary(id: number): Promise<EmailSummary | undefined> {
    const [email] = await db
      .select()
      .from(emailSummaries)
      .where(eq(emailSummaries.id, id));
    return email || undefined;
  }

  async createEmailSummary(email: InsertEmailSummary): Promise<EmailSummary> {
    const [created] = await db
      .insert(emailSummaries)
      .values(email)
      .returning();
    return created;
  }

  async updateEmailSummary(id: number, updates: UpdateEmailSummary): Promise<EmailSummary | undefined> {
    const [updated] = await db
      .update(emailSummaries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailSummaries.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEmailSummary(id: number): Promise<boolean> {
    const result = await db
      .delete(emailSummaries)
      .where(eq(emailSummaries.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async deleteAllEmailSummaries(): Promise<void> {
    await db.delete(emailSummaries);
  }
}

export const storage = new DatabaseStorage();
