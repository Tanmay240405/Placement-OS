import type { gmail_v1 } from "googleapis";
import type { ExtractedEmail } from "@/types";

/**
 * Extracts structured email data from a raw Gmail API message object.
 * Decodes base64url-encoded body parts and extracts metadata from headers.
 */
export function extractMessage(
  message: gmail_v1.Schema$Message
): ExtractedEmail {
  const headers = message.payload?.headers || [];

  const getHeader = (name: string): string => {
    const header = headers.find(
      (h) => h.name?.toLowerCase() === name.toLowerCase()
    );
    return header?.value || "";
  };

  const subject = getHeader("Subject");
  const sender = getHeader("From");
  const dateStr = getHeader("Date");
  const receivedAt = dateStr ? new Date(dateStr) : new Date();

  // Extract body parts
  let textBody = "";
  let htmlBody = "";

  function extractParts(payload: gmail_v1.Schema$MessagePart | undefined) {
    if (!payload) return;

    // Single-part message
    if (payload.mimeType === "text/plain" && payload.body?.data) {
      textBody = decodeBase64Url(payload.body.data);
    } else if (payload.mimeType === "text/html" && payload.body?.data) {
      htmlBody = decodeBase64Url(payload.body.data);
    }

    // Multi-part message
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          textBody = decodeBase64Url(part.body.data);
        } else if (part.mimeType === "text/html" && part.body?.data) {
          htmlBody = decodeBase64Url(part.body.data);
        } else if (
          part.mimeType?.startsWith("multipart/") &&
          part.parts
        ) {
          // Nested multipart
          extractParts(part);
        }
      }
    }
  }

  extractParts(message.payload);

  return {
    gmailMessageId: message.id || "",
    threadId: message.threadId || "",
    subject,
    sender,
    receivedAt,
    textBody,
    htmlBody,
  };
}

/**
 * Decodes a base64url-encoded string (Gmail API format).
 */
function decodeBase64Url(encoded: string): string {
  // Replace URL-safe characters
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    console.error("Failed to decode base64url string");
    return "";
  }
}
