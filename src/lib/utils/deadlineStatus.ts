import type { DeadlineStatus } from "@/types";

/**
 * Computes the display status of a deadline relative to now.
 *
 * Returns:
 * - expired: deadline has passed
 * - urgent: deadline is within 24 hours
 * - upcoming: deadline is within 3 days
 * - normal: deadline is further away
 * - unknown: no deadline available
 */
export function getDeadlineStatus(
  deadline: Date | string | null | undefined
): DeadlineStatus {
  if (!deadline) return { type: "unknown" };

  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : deadline;

  if (isNaN(deadlineDate.getTime())) return { type: "unknown" };

  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();

  if (diffMs < 0) {
    return { type: "expired" };
  }

  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return {
      type: "urgent",
      text: `Deadline in ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`,
    };
  }

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    return {
      type: "urgent",
      text: `Deadline in ${hours} hour${hours !== 1 ? "s" : ""}`,
    };
  }

  if (diffDays < 2) {
    return {
      type: "urgent",
      text: "Deadline tomorrow",
    };
  }

  if (diffDays < 3) {
    return {
      type: "upcoming",
      text: `Deadline in ${Math.floor(diffDays)} days`,
    };
  }

  return {
    type: "normal",
    text: `Deadline: ${formatDeadlineDate(deadlineDate)}`,
  };
}

/**
 * Formats a deadline date for display.
 */
export function formatDeadlineDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a relative time string like "2 minutes ago", "1 hour ago".
 */
export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "Never";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Never";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7)
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
