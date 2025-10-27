import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Email summaries table - stores processed emails with AI-generated summaries
export const emailSummaries = pgTable("email_summaries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sender: text("sender").notNull(),
  senderEmail: text("sender_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(), // Meeting, Invoice, Support Request, etc.
  processedAt: timestamp("processed_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schema for creating new email summaries
export const insertEmailSummarySchema = createInsertSchema(emailSummaries).omit({
  id: true,
  processedAt: true,
  updatedAt: true,
});

// Update schema for re-summarization
export const updateEmailSummarySchema = z.object({
  summary: z.string().min(1),
  category: z.string().min(1),
  updatedAt: z.date().optional(),
});

// Types
export type EmailSummary = typeof emailSummaries.$inferSelect;
export type InsertEmailSummary = z.infer<typeof insertEmailSummarySchema>;
export type UpdateEmailSummary = z.infer<typeof updateEmailSummarySchema>;

// Category enum for type safety
export const EmailCategory = {
  MEETING: "Meeting",
  INVOICE: "Invoice",
  SUPPORT_REQUEST: "Support Request",
  NEWSLETTER: "Newsletter",
  ANNOUNCEMENT: "Announcement",
  PERSONAL: "Personal",
  OTHER: "Other",
} as const;

export type EmailCategoryType = typeof EmailCategory[keyof typeof EmailCategory];
