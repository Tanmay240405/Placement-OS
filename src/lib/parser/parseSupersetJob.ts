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

    // Step 2: Extract fields (each parser handles its own errors)
    const companyName = safeExtract(
      () => parseCompany(email.subject, email.textBody),
      "companyName"
    );

    const roles = safeExtract(
      () => parseRoles(email.subject, email.textBody),
      "roles"
    ) || [];

    const category = safeExtract(
      () => parseCategory(email.textBody),
      "category"
    );

    const deadline = safeExtract(
      () => parseDeadline(email.textBody, email.receivedAt),
      "deadline"
    ) || { raw: null, datetime: null };

    const applicationUrl = safeExtract(
      () => parseApplicationLink(email.htmlBody),
      "applicationUrl"
    );

    // Step 3: Build the parsed opportunity
    return {
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
