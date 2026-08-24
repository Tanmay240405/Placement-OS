/**
 * Extracts job roles from a Superset email.
 *
 * Handles formats:
 * - "Job 1 - QA Intern, Job 2 - SDE Intern, Job 3 - Data Analyst"
 * - "Job 1 - QA Intern\nJob 2 - SDE Intern\nJob 3 - Data Analyst"
 * - "Job Profile - Software Engineer Intern" (single role)
 * - "Job Profile : Software Engineer Intern" (single role variant)
 */
export function parseRoles(subject: string, textBody: string): string[] {
  const combined = `${subject}\n${textBody}`;
  const roles: string[] = [];

  // Pattern 1: "Job N - Role Name" (numbered jobs)
  const numberedPattern = /Job\s*\d+\s*[-–—:]\s*([^,\n]+)/gi;
  let match;

  while ((match = numberedPattern.exec(combined)) !== null) {
    const role = match[1].trim();
    if (role && !roles.includes(role)) {
      roles.push(role);
    }
  }

  if (roles.length > 0) {
    return cleanRoles(roles);
  }

  // Pattern 2: "Job Profile - Role Name" (single role)
  const singlePatterns = [
    /Job Profile\s*[-–—:]\s*([^,\n]+)/i,
    /Job Profile\s*Category\s*[-–—:]\s*\w+[\s\S]*?(?:for|[-–—:])\s*([^,\n]+)/i,
  ];

  for (const pattern of singlePatterns) {
    const singleMatch = combined.match(pattern);
    if (singleMatch?.[1]) {
      const role = singleMatch[1].trim();
      // Don't include category values as roles
      if (
        role &&
        !["internship", "full time", "full-time", "placement"].includes(
          role.toLowerCase()
        )
      ) {
        return [role];
      }
    }
  }

  return roles;
}

/**
 * Cleans up extracted role names.
 * Removes trailing punctuation, extra whitespace, and common noise.
 */
function cleanRoles(roles: string[]): string[] {
  return roles
    .map((role) =>
      role
        .replace(/[,;.]+$/, "") // Remove trailing punctuation
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()
    )
    .filter((role) => role.length > 0);
}
