import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeEmail } from "./openai";
import { insertEmailSummarySchema } from "@shared/schema";
import { mockEmails } from "@shared/mockEmails";

// Fallback summaries for when OpenAI fails
function getFallbackCategory(subject: string): string {
  const lowerSubject = subject.toLowerCase();
  if (lowerSubject.includes("meeting") || lowerSubject.includes("schedule")) return "Meeting";
  if (lowerSubject.includes("invoice") || lowerSubject.includes("payment") || lowerSubject.includes("bill")) return "Invoice";
  if (lowerSubject.includes("urgent") || lowerSubject.includes("issue") || lowerSubject.includes("problem")) return "Support Request";
  if (lowerSubject.includes("newsletter") || lowerSubject.includes("digest") || lowerSubject.includes("week in")) return "Newsletter";
  if (lowerSubject.includes("announcement") || lowerSubject.includes("important") || lowerSubject.includes("maintenance")) return "Announcement";
  if (lowerSubject.includes("job") || lowerSubject.includes("deliverable") || lowerSubject.includes("project")) return "Personal";
  return "Other";
}

function getFallbackSummary(subject: string, body: string): string {
  // Extract first 200 characters of body for simple summary
  const preview = body.substring(0, 200).replace(/\n/g, " ").trim();
  return `${subject}. ${preview}${body.length > 200 ? "..." : ""}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all email summaries
  app.get("/api/emails", async (_req, res) => {
    try {
      const emails = await storage.getAllEmailSummaries();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ 
        error: "Failed to fetch emails",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Process mock emails - load and analyze with OpenAI
  app.post("/api/emails/process", async (_req, res) => {
    try {
      // Clear existing data first
      await storage.deleteAllEmailSummaries();

      const processedEmails = [];

      // Process each mock email with OpenAI
      for (const mockEmail of mockEmails) {
        try {
          console.log(`Processing email: ${mockEmail.subject}`);
          
          try {
            const analysis = await analyzeEmail(
              mockEmail.sender,
              mockEmail.subject,
              mockEmail.body
            );

            const emailData = insertEmailSummarySchema.parse({
              sender: mockEmail.sender,
              senderEmail: mockEmail.senderEmail,
              subject: mockEmail.subject,
              body: mockEmail.body,
              summary: analysis.summary,
              category: analysis.category,
            });

            const created = await storage.createEmailSummary(emailData);
            processedEmails.push(created);
            
            console.log(`✓ Processed: ${mockEmail.subject} -> ${analysis.category}`);
          } catch (openaiError) {
            // If OpenAI fails due to encoding issues, use fallback summaries
            console.warn(`OpenAI processing failed for "${mockEmail.subject}", using fallback`);
            
            const fallbackCategory = getFallbackCategory(mockEmail.subject);
            const fallbackSummary = getFallbackSummary(mockEmail.subject, mockEmail.body);
            
            const emailData = insertEmailSummarySchema.parse({
              sender: mockEmail.sender,
              senderEmail: mockEmail.senderEmail,
              subject: mockEmail.subject,
              body: mockEmail.body,
              summary: fallbackSummary,
              category: fallbackCategory,
            });

            const created = await storage.createEmailSummary(emailData);
            processedEmails.push(created);
            console.log(`✓ Processed with fallback: ${mockEmail.subject} -> ${fallbackCategory}`);
          }
        } catch (error) {
          console.error(`Failed to process email "${mockEmail.subject}":`, error);
          // Continue with other emails even if one fails
        }
      }

      res.json({
        success: true,
        count: processedEmails.length,
        emails: processedEmails,
      });
    } catch (error) {
      console.error("Error processing emails:", error);
      res.status(500).json({ 
        error: "Failed to process emails",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Re-summarize a single email
  app.post("/api/emails/:id/resummarize", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.getEmailSummary(id);

      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }

      console.log(`Re-summarizing email: ${email.subject}`);

      const analysis = await analyzeEmail(
        email.sender,
        email.subject,
        email.body
      );

      const updated = await storage.updateEmailSummary(id, {
        summary: analysis.summary,
        category: analysis.category,
      });

      console.log(`✓ Re-summarized: ${email.subject} -> ${analysis.category}`);

      res.json(updated);
    } catch (error) {
      console.error("Error re-summarizing email:", error);
      res.status(500).json({ 
        error: "Failed to re-summarize email",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete an email summary
  app.delete("/api/emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEmailSummary(id);

      if (!success) {
        return res.status(404).json({ error: "Email not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting email:", error);
      res.status(500).json({ 
        error: "Failed to delete email",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
