/**
 * Extracts the application URL from a Superset email's HTML body.
 *
 * Looks for anchor tags where the visible text matches:
 * - "Click to Apply"
 * - "Apply"
 * - "Apply Now"
 * - "Apply Here"
 *
 * The actual URL may be an AWS tracking/redirect URL.
 * We keep it as-is and let the browser handle the redirect.
 */
export function parseApplicationLink(htmlBody: string): string | null {
  if (!htmlBody) return null;

  // Pattern: Find <a> tags with matching text content
  // This handles various HTML formatting (attributes, whitespace, etc.)
  const anchorPattern =
    /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  const applyTextPatterns = [
    /click\s+to\s+apply/i,
    /apply\s+now/i,
    /apply\s+here/i,
    /^apply$/i,
  ];

  let match;
  while ((match = anchorPattern.exec(htmlBody)) !== null) {
    const url = match[1];
    // Strip HTML tags from the visible text to get plain text content
    const visibleText = match[2].replace(/<[^>]*>/g, "").trim();

    for (const textPattern of applyTextPatterns) {
      if (textPattern.test(visibleText)) {
        // Decode HTML entities in the URL
        return decodeHtmlEntities(url);
      }
    }
  }

  // Fallback: Look for any URL near "apply" text
  const fallbackPattern =
    /<a\s+[^>]*href\s*=\s*["']([^"']*(?:superset|joinsuperset)[^"']*)["'][^>]*>/i;
  const fallbackMatch = htmlBody.match(fallbackPattern);

  if (fallbackMatch?.[1]) {
    return decodeHtmlEntities(fallbackMatch[1]);
  }

  return null;
}

/**
 * Decodes common HTML entities in URLs.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
