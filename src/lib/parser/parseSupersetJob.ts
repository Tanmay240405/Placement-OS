import type { ExtractedEmail, ParsedOpportunity } from "@/types";
import { classifyEmail } from "./classifyEmail";
import { parseCompany } from "./parseCompany";
import { parseRoles } from "./parseRoles";
import { parseCategory } from "./parseCategory";
import { parseDeadline } from "./parseDeadline";
import { parseApplicationLink } from "./parseApplicationLink";

/**
 * Main parser orchestrator.
 *
 * Takes a raw extracted email and:
 * 1. Classifies it (JOB_OPENING vs OTHER_SUPERSET)
 * 2. If JOB_OPENING, extracts all structured fields
 * 3. Returns a ParsedOpportunity or null
 *
 * Each sub-parser fails gracefully — if one field cannot be extracted,
 * the others still work. The function never throws.
 */
export function parseSupersetJobEmail(
  email: ExtractedEmail
): ParsedOpportunity | null {
  try {
    // Step 1: Classify
    const classification = classifyEmail(email);
    if (classification !== "JOB_OPENING") {
      return null;
    }

    // Create a clean, purely text version of the body
    const rawBody = email.textBody || email.htmlBody || "";
    const cleanText = rawBody
      .replace(/<\/?(?:br|p|div|tr|td|th|li|h[1-6])[^>]*>/gi, '\n') // Replace structural tags with newlines
      .replace(/<[^>]*>?/gm, '') // Strip remaining tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/\r/g, '') // Strip carriage returns to normalize newlines to Unix format
      .replace(/^[ \t]+/gm, '') // Remove leading spaces on each line
      .replace(/\n{2,}/g, '\n') // Replace multiple newlines with a single newline
      .trim();

    // Step 2: Extract fields (each parser handles its own errors)
    const companyName = safeExtract(
      () => parseCompany(email.subject, cleanText),
      "companyName"
    );

    const roles = safeExtract(
      () => parseRoles(email.subject, cleanText),
      "roles"
    ) || [];

    const category = safeExtract(
      () => parseCategory(cleanText),
      "category"
    );

    const deadline = safeExtract(
      () => parseDeadline(cleanText, email.receivedAt),
      "deadline"
    ) || { raw: null, datetime: null };

    const applicationUrl = safeExtract(
      () => parseApplicationLink(email.htmlBody),
      "applicationUrl"
    );

    // Step 3: Build the parsed opportunity
    const result = {
      gmailMessageId: email.gmailMessageId,
      threadId: email.threadId,
      sender: email.sender,
      emailSubject: email.subject,
      companyName,
      roles,
      category,
      deadlineRaw: deadline.raw,
      deadlineDatetime: deadline.datetime,
      applicationUrl,
      receivedAt: email.receivedAt,
    };

    // DEBUG LOGGING
    if (email.subject.includes("Eaton")) {
      const fs = require('fs');
      fs.appendFileSync('debug.txt', `\n\n--- PARSING EATON INDIA ---\nCLEAN TEXT:\n${cleanText}\n\nDEADLINE RAW: ${deadline.raw}\nDEADLINE DATETIME: ${deadline.datetime}\n`);
    }

    return result;
  } catch (error) {
    console.error(
      `Failed to parse Superset email ${email.gmailMessageId}:`,
      error
    );
    return null;
  }
}

/**
 * Safely executes a parser function and returns null on error.
 * Logs the error for debugging.
 */
function safeExtract<T>(fn: () => T, fieldName: string): T | null {
  try {
    return fn();
  } catch (error) {
    console.error(`Failed to extract ${fieldName}:`, error);
    return null;
  }
}
