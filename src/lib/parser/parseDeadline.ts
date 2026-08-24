import type { ParsedDeadline } from "@/types";

/**
 * Month name to number mapping.
 */
const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Extracts the deadline from a Superset email body.
 *
 * Handles patterns:
 * - "Deadline : Aug 22, 11:13 AM"
 * - "Deadline : Aug 22, 2026, 11:13 AM"
 * - "Deadline: August 22, 11:13 AM"
 *
 * If the year is missing, infers it based on:
 * 1. Email received date
 * 2. Current year
 * 3. Whether the deadline logically occurs before or after the email date
 */
export function parseDeadline(
  textBody: string,
  receivedAt: Date
): ParsedDeadline {
  // Extract raw deadline string
  const deadlinePattern = /Deadline\s*[:–—-]\s*(.+?)(?:\n|$)/i;
  const match = textBody.match(deadlinePattern);

  if (!match?.[1]) {
    return { raw: null, datetime: null };
  }

  const raw = match[1].trim();
  const datetime = parseDeadlineDate(raw, receivedAt);

  return { raw, datetime };
}

/**
 * Parses a deadline date string into a Date object.
 * Handles missing year by inferring from context.
 */
function parseDeadlineDate(
  raw: string,
  receivedAt: Date
): Date | null {
  try {
    // Pattern: "Aug 22, 2026, 11:13 AM" (with year)
    const withYearPattern =
      /(\w+)\s+(\d{1,2}),?\s+(\d{4}),?\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const withYearMatch = raw.match(withYearPattern);

    if (withYearMatch) {
      const [, monthStr, day, year, hour, minute, ampm] = withYearMatch;
      return buildDate(monthStr, parseInt(day), parseInt(year), parseInt(hour), parseInt(minute), ampm);
    }

    // Pattern: "Aug 22, 11:13 AM" (without year)
    const withoutYearPattern =
      /(\w+)\s+(\d{1,2}),?\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const withoutYearMatch = raw.match(withoutYearPattern);

    if (withoutYearMatch) {
      const [, monthStr, day, hour, minute, ampm] = withoutYearMatch;
      const year = inferYear(
        monthStr,
        parseInt(day),
        receivedAt
      );
      return buildDate(monthStr, parseInt(day), year, parseInt(hour), parseInt(minute), ampm);
    }

    // Pattern: "Aug 22, 2026" (date only, no time)
    const dateOnlyWithYear = /(\w+)\s+(\d{1,2}),?\s+(\d{4})/i;
    const dateOnlyWithYearMatch = raw.match(dateOnlyWithYear);

    if (dateOnlyWithYearMatch) {
      const [, monthStr, day, year] = dateOnlyWithYearMatch;
      return buildDate(monthStr, parseInt(day), parseInt(year), 23, 59, "PM");
    }

    // Pattern: "Aug 22" (date only, no time, no year)
    const dateOnly = /(\w+)\s+(\d{1,2})/i;
    const dateOnlyMatch = raw.match(dateOnly);

    if (dateOnlyMatch) {
      const [, monthStr, day] = dateOnlyMatch;
      const year = inferYear(monthStr, parseInt(day), receivedAt);
      return buildDate(monthStr, parseInt(day), year, 23, 59, "PM");
    }

    return null;
  } catch (error) {
    console.error("Failed to parse deadline date:", raw, error);
    return null;
  }
}

/**
 * Builds a Date object from components.
 */
function buildDate(
  monthStr: string,
  day: number,
  year: number,
  hour: number,
  minute: number,
  ampm: string
): Date | null {
  const monthLower = monthStr.toLowerCase();
  const month = MONTHS[monthLower];

  if (month === undefined) return null;

  // Convert 12-hour to 24-hour format
  let hour24 = hour;
  const isAM = ampm.toUpperCase() === "AM";
  const isPM = ampm.toUpperCase() === "PM";

  if (isPM && hour !== 12) {
    hour24 = hour + 12;
  } else if (isAM && hour === 12) {
    hour24 = 0;
  }

  const date = new Date(year, month, day, hour24, minute, 0);

  // Validate the date
  if (isNaN(date.getTime())) return null;

  return date;
}

/**
 * Infers the year for a deadline when not explicitly specified.
 *
 * Logic:
 * - Start with the year the email was received
 * - If the resulting date is more than 30 days before the email received date,
 *   assume it's next year (deadlines are typically in the future)
 */
function inferYear(
  monthStr: string,
  day: number,
  receivedAt: Date
): number {
  const monthLower = monthStr.toLowerCase();
  const month = MONTHS[monthLower];

  if (month === undefined) return receivedAt.getFullYear();

  const candidateDate = new Date(
    receivedAt.getFullYear(),
    month,
    day
  );

  // If the candidate date is more than 30 days in the past relative
  // to when the email was received, it's likely next year
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  if (candidateDate.getTime() < receivedAt.getTime() - thirtyDaysMs) {
    return receivedAt.getFullYear() + 1;
  }

  return receivedAt.getFullYear();
}
