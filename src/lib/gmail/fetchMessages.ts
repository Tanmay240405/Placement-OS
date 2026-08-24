import type { gmail_v1 } from "googleapis";

/**
 * Fetches Superset email message IDs from the last 30 days.
 * Handles pagination to fetch all matching messages.
 */
export async function fetchSupersetMessageIds(
  gmail: gmail_v1.Gmail
): Promise<string[]> {
  const query = "from:notifications@joinsuperset.com newer_than:30d";
  const messageIds: string[] = [];
  let pageToken: string | undefined;

  do {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 100,
      pageToken,
    });

    const messages = response.data.messages || [];
    for (const message of messages) {
      if (message.id) {
        messageIds.push(message.id);
      }
    }

    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return messageIds;
}

/**
 * Fetches the full message data for a given message ID.
 */
export async function fetchFullMessage(
  gmail: gmail_v1.Gmail,
  messageId: string
): Promise<gmail_v1.Schema$Message> {
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  return response.data;
}
