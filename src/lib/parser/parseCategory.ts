/**
 * Extracts the job category from a Superset email.
 *
 * Handles patterns:
 * - "in Internship category"
 * - "Job Profile Category : Internship"
 * - "in Full Time category"
 *
 * Normalizes values:
 * - "Full-time" → "Full Time"
 * - "full time" → "Full Time"
 * - "internship" → "Internship"
 * - "placement" → "Placement"
 */
export function parseCategory(textBody: string): string | null {
  const patterns = [
    /in\s+(.+?)\s+category/i,
    /Job Profile Category\s*[:–—-]\s*(.+?)(?:\n|$)/i,
    /category\s*[:–—-]\s*(.+?)(?:\n|$)/i,
  ];

  for (const pattern of patterns) {
    const match = textBody.match(pattern);
    if (match?.[1]) {
      return normalizeCategory(match[1].trim());
    }
  }

  return null;
}

/**
 * Normalizes category strings to consistent values.
 */
function normalizeCategory(raw: string): string {
  const lower = raw.toLowerCase().trim();

  if (lower === "internship" || lower === "intern") {
    return "Internship";
  }

  if (
    lower === "full time" ||
    lower === "full-time" ||
    lower === "fulltime"
  ) {
    return "Full Time";
  }

  if (lower === "placement") {
    return "Placement";
  }

  if (lower === "part time" || lower === "part-time") {
    return "Part Time";
  }

  // Capitalize first letter of each word for unknown categories
  return raw
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
