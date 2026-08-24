/**
 * Extracts the company name from a Superset email.
 *
 * Tries multiple patterns:
 * 1. "Open for application - [COMPANY]'s Job Profile"
 * 2. "Applications are now being accepted for [COMPANY]'s Job Profile"
 * 3. "New Job Opening from [COMPANY]!"
 * 4. "[COMPANY]'s Job Profile" (generic fallback)
 */
export function parseCompany(
  subject: string,
  textBody: string
): string | null {
  const combined = `${subject}\n${textBody}`;

  const patterns = [
    // "Open for application - COMPANY's Job Profile"
    /Open for application\s*[-–—:]\s*(.+?)(?:'s|'s|'s)\s*Job Profile/i,

    // "Applications are now being accepted for COMPANY's Job Profile"
    /Applications are now being accepted for\s+(.+?)(?:'s|'s|'s)\s*Job Profile/i,

    // "New Job Opening from COMPANY!"
    /New Job Opening from\s+(.+?)!/i,

    // Generic: "COMPANY's Job Profile"
    /(.+?)(?:'s|'s|'s)\s*Job Profile/i,
  ];

  for (const pattern of patterns) {
    const match = combined.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}
