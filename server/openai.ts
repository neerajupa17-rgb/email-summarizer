// Based on blueprint:javascript_openai
/*
Follow these instructions when using this blueprint:
1. Note that the newest OpenAI model is "gpt-5", not "gpt-4o" or "gpt-4". gpt-5 was released on August 7, 2025, after your knowledge cutoff. Always prefer using gpt-5 as it is the latest model. When copying code from this blueprint, ensure you also mention this information verbatim as a comment so that you don't revert it to older models: `// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user`
2. Use the response_format: { type: "json_object" } option
3. Request output in JSON format in the prompt
4. gpt-5 doesn't support temperature parameter, do not use it.
*/

export interface EmailAnalysisResult {
  summary: string;
  category: string;
}

/**
 * Sanitizes text to ensure only ASCII-safe characters
 * Replaces problematic unicode characters that cause ByteString conversion errors
 */
function sanitizeText(text: string): string {
  return text
    // Replace smart quotes with regular quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace en-dash and em-dash with regular dash
    .replace(/[\u2013\u2014]/g, "-")
    // Replace ellipsis with three dots
    .replace(/\u2026/g, "...")
    // Remove any remaining non-ASCII characters
    .replace(/[^\x00-\x7F]/g, " ")
    // Clean up multiple spaces
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Analyzes an email and generates a 2-3 sentence summary with category classification
 * Uses GPT-5 for intelligent email understanding
 * Uses fetch API directly to avoid SDK header encoding issues
 */
export async function analyzeEmail(
  sender: string,
  subject: string,
  body: string
): Promise<EmailAnalysisResult> {
  try {
    // Sanitize all text inputs to prevent encoding errors
    const sanitizedSender = sanitizeText(sender);
    const sanitizedSubject = sanitizeText(subject);
    const sanitizedBody = sanitizeText(body);
    
    // Debug logging
    console.log(`Sanitized sender: ${sanitizedSender.length} chars`);
    console.log(`Sanitized subject: ${sanitizedSubject.length} chars`);
    console.log(`Sanitized body: ${sanitizedBody.length} chars`);

    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert email assistant that analyzes emails and provides concise summaries with accurate categorization.

Your task:
1. Read the email content carefully
2. Generate a concise 2-3 sentence summary that captures the key points and action items
3. Classify the email into one of these categories: Meeting, Invoice, Support Request, Newsletter, Announcement, Personal, or Other

Respond with JSON in this exact format:
{
  "summary": "2-3 sentence summary here",
  "category": "Category Name"
}

Categories guide:
- Meeting: Scheduling, invitations, meeting notes, calendar events
- Invoice: Bills, payments, financial documents, receipts
- Support Request: Help requests, bug reports, technical issues
- Newsletter: Marketing emails, updates, digests, subscriptions
- Announcement: Company news, product launches, important updates
- Personal: Direct personal communication, casual messages
- Other: Anything that doesn't fit the above categories`,
          },
          {
            role: "user",
            content: `Analyze this email:

From: ${sanitizedSender}
Subject: ${sanitizedSubject}

Body:
${sanitizedBody}`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content || "{}");

    return {
      summary: result.summary || "Unable to generate summary",
      category: result.category || "Other",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to analyze email: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Batch process multiple emails with error handling for each
 */
export async function analyzeEmailBatch(
  emails: Array<{ sender: string; subject: string; body: string }>
): Promise<Array<EmailAnalysisResult | { error: string }>> {
  const results = await Promise.allSettled(
    emails.map((email) => analyzeEmail(email.sender, email.subject, email.body))
  );

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return { error: result.reason.message || "Analysis failed" };
    }
  });
}
