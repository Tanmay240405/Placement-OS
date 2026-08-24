import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

/**
 * Creates an authenticated Gmail API client for a user.
 * Retrieves the access token from the Account table and refreshes if expired.
 */
export async function createGmailClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!account || !account.access_token) {
    throw new Error("No Google account connected. Please sign in with Google.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  // Check if token is expired and refresh if needed
  const now = Math.floor(Date.now() / 1000);
  const isExpired = account.expires_at ? now >= account.expires_at : false;

  if (isExpired && account.refresh_token) {
    oauth2Client.setCredentials({
      refresh_token: account.refresh_token,
    });

    try {
      const { credentials } = await oauth2Client.refreshAccessToken();

      // Update the stored tokens
      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: account.providerAccountId,
          },
        },
        data: {
          access_token: credentials.access_token,
          expires_at: credentials.expiry_date
            ? Math.floor(credentials.expiry_date / 1000)
            : null,
        },
      });

      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw new Error(
        "Failed to refresh Gmail access. Please reconnect your Google account."
      );
    }
  } else {
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
}
