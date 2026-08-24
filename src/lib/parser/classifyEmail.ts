import type { EmailClassification, ExtractedEmail } from "@/types";

/**
 * Job opening indicator keywords.
 * If any of these appear in the subject or body, classify as JOB_OPENING.
 */
const JOB_OPENING_INDICATORS = [
  "open for application",
  "new job opening",
  "applications are now being accepted",
  "job profile",
  "click to apply",
];

/**
 * Classifies a Superset email into a category.
 *
 * Currently supports:
 * - JOB_OPENING: A new job/internship opportunity
 * - OTHER_SUPERSET: Any other email from Superset
 *
 * The classification is modular and can be extended to support:
 * ONLINE_ASSESSMENT, INTERVIEW, SHORTLISTED, SELECTED, REJECTED
 */
export function classifyEmail(email: ExtractedEmail): EmailClassification {
  const senderLower = email.sender.toLowerCase();

  // Must be from Superset notifications
  if (!senderLower.includes("notifications@joinsuperset.com")) {
    return "OTHER_SUPERSET";
  }

  const subjectLower = email.subject.toLowerCase();
  const bodyLower = email.textBody.toLowerCase();
  const combined = `${subjectLower} ${bodyLower}`;

  // Check for exclusion indicators (emails that are NOT job openings)
  const EXCLUSION_INDICATORS = [
    "application submitted",
    "deadline for applications changed",
  ];
  
  for (const indicator of EXCLUSION_INDICATORS) {
    if (combined.includes(indicator)) {
      return "OTHER_SUPERSET";
    }
  }

  // Check for job opening indicators
  for (const indicator of JOB_OPENING_INDICATORS) {
    if (combined.includes(indicator)) {
      return "JOB_OPENING";
    }
  }

  return "OTHER_SUPERSET";
}
